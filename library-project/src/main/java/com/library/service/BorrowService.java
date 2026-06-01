package com.library.service;

import com.library.config.AppConfig;
import com.library.dto.request.BorrowRequest;
import com.library.dto.response.BorrowResponse;
import com.library.dto.response.PageResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.*;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BorrowService {

    private final BorrowRecordRepository borrowRepository;
    private final BookRepository         bookRepository;
    private final BookCopyRepository     copyRepository;
    private final FineRepository         fineRepository;
    private final ReservationRepository  reservationRepository;
    private final UserRepository         userRepository;
    private final AppConfig              appConfig;

    // ── Mượn sách ─────────────────────────────────────────
    @Transactional
    public BorrowResponse borrowBook(String username, BorrowRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        Book book = bookRepository.findById(req.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Sách", req.getBookId()));

        // Rule 1: Không mượn nếu còn phạt chưa trả
        if (fineRepository.existsByUserIdAndStatus(user.getId(), Fine.FineStatus.PENDING))
            throw new BusinessException("Bạn còn tiền phạt chưa thanh toán. Vui lòng thanh toán trước khi mượn thêm sách.");

        // Rule 2: Giới hạn số sách đang mượn
        long activeBorrows = borrowRepository.countByUserIdAndStatus(user.getId(), BorrowRecord.BorrowStatus.BORROWED);
        if (activeBorrows >= appConfig.getMaxBorrowLimit())
            throw new BusinessException("Bạn đang mượn " + activeBorrows + " cuốn, đã đạt giới hạn " + appConfig.getMaxBorrowLimit() + " cuốn/lần.");

        // Rule 3: Kiểm tra còn bản sao không
        if (book.getAvailableCopies() <= 0)
            throw new BusinessException("Sách '" + book.getTitle() + "' hiện không còn bản sao nào để mượn.");

        // Lấy bản sao AVAILABLE (pessimistic: lấy theo id ASC để tránh race condition)
        List<BookCopy> available = copyRepository.findAvailableCopiesByBookId(book.getId());
        if (available.isEmpty())
            throw new BusinessException("Không tìm thấy bản sao sách khả dụng.");

        BookCopy copy = available.get(0);
        copy.setStatus(BookCopy.CopyStatus.BORROWED);
        copyRepository.save(copy);

        // Cập nhật số lượng
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Tạo borrow record
        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .bookCopy(copy)
                .borrowDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(appConfig.getBorrowDurationDays()))
                .status(BorrowRecord.BorrowStatus.BORROWED)
                .notes(req.getNotes())
                .build();

        return BorrowResponse.from(borrowRepository.save(record));
    }

    // ── Trả sách ──────────────────────────────────────────
    @Transactional
    public BorrowResponse returnBook(Long borrowId) {
        BorrowRecord record = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new ResourceNotFoundException("Phiếu mượn", borrowId));

        if (record.getStatus() == BorrowRecord.BorrowStatus.RETURNED)
            throw new BusinessException("Sách này đã được trả trước đó.");

        LocalDate today = LocalDate.now();
        record.setReturnDate(today);

        // Tính phạt nếu trả trễ
        if (today.isAfter(record.getDueDate())) {
            long daysOverdue = today.toEpochDay() - record.getDueDate().toEpochDay();
            BigDecimal amount = BigDecimal.valueOf(daysOverdue * appConfig.getFinePerDay());

            record.setStatus(BorrowRecord.BorrowStatus.OVERDUE);
            borrowRepository.save(record);

            // Tạo fine nếu chưa có
            if (fineRepository.findByBorrowRecordId(borrowId).isEmpty()) {
                Fine fine = Fine.builder()
                        .borrowRecord(record)
                        .user(record.getUser())
                        .daysOverdue((int) daysOverdue)
                        .amount(amount)
                        .status(Fine.FineStatus.PENDING)
                        .build();
                fineRepository.save(fine);
            }
        } else {
            record.setStatus(BorrowRecord.BorrowStatus.RETURNED);
            borrowRepository.save(record);
        }

        // Trả bản sao về AVAILABLE
        BookCopy copy = record.getBookCopy();
        copy.setStatus(BookCopy.CopyStatus.AVAILABLE);
        copyRepository.save(copy);

        // Cập nhật available_copies
        Book book = copy.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Kích hoạt reservation đang WAITING nếu có
        activateNextReservation(book);

        return BorrowResponse.from(record);
    }

    // ── Lịch sử mượn của user ─────────────────────────────
    public PageResponse<BorrowResponse> getMyHistory(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        var pageable = PageRequest.of(page, size, Sort.by("borrowDate").descending());
        return new PageResponse<>(
            borrowRepository.findByUserIdOrderByBorrowDateDesc(user.getId(), pageable).map(BorrowResponse::from)
        );
    }

    // ── Danh sách đang mượn (Librarian) ───────────────────
    public PageResponse<BorrowResponse> getActiveBorrows(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("borrowDate").descending());
        return new PageResponse<>(
            borrowRepository.findByStatusOrderByBorrowDateDesc(BorrowRecord.BorrowStatus.BORROWED, pageable)
                .map(BorrowResponse::from)
        );
    }

    // ── Danh sách quá hạn ─────────────────────────────────
    public PageResponse<BorrowResponse> getOverdueBorrows(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        return new PageResponse<>(
            borrowRepository.findByStatusOrderByBorrowDateDesc(BorrowRecord.BorrowStatus.OVERDUE, pageable)
                .map(BorrowResponse::from)
        );
    }

    public BorrowResponse getById(Long id) {
        return BorrowResponse.from(borrowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phiếu mượn", id)));
    }

    // ── Scheduled job: tự động đánh dấu OVERDUE mỗi đêm ──
    @Scheduled(cron = "0 0 1 * * *") // 1:00 AM mỗi ngày
    @Transactional
    public void markOverdueRecords() {
        List<BorrowRecord> overdueList = borrowRepository.findAllOverdue(LocalDate.now());
        log.info("⏰ Scheduled job: Tìm thấy {} phiếu quá hạn", overdueList.size());

        for (BorrowRecord record : overdueList) {
            record.setStatus(BorrowRecord.BorrowStatus.OVERDUE);
            borrowRepository.save(record);

            long daysOverdue = LocalDate.now().toEpochDay() - record.getDueDate().toEpochDay();
            BigDecimal amount = BigDecimal.valueOf(daysOverdue * appConfig.getFinePerDay());

            fineRepository.findByBorrowRecordId(record.getId()).ifPresentOrElse(
                fine -> {
                    fine.setDaysOverdue((int) daysOverdue);
                    fine.setAmount(amount);
                    fineRepository.save(fine);
                },
                () -> {
                    Fine fine = Fine.builder()
                            .borrowRecord(record).user(record.getUser())
                            .daysOverdue((int) daysOverdue).amount(amount)
                            .status(Fine.FineStatus.PENDING).build();
                    fineRepository.save(fine);
                }
            );
        }
    }

    // ── Kích hoạt reservation kế tiếp ────────────────────
    private void activateNextReservation(Book book) {
        List<?> waiting = reservationRepository.findWaitingByBookIdOrderByDate(book.getId());
        if (!waiting.isEmpty()) {
            Reservation res = (Reservation) waiting.get(0);
            res.setStatus(Reservation.ReservationStatus.READY);
            res.setExpiresAt(LocalDateTime.now().plusDays(appConfig.getReservationHoldDays()));
            reservationRepository.save(res);
            log.info("📚 Đã kích hoạt reservation #{} cho user {}", res.getId(), res.getUser().getUsername());
        }
    }
}
