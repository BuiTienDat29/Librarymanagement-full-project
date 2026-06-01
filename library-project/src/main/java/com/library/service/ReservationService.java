package com.library.service;

import com.library.config.AppConfig;
import com.library.dto.request.ReservationRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.ReservationResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Book;
import com.library.model.Reservation;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository        bookRepository;
    private final UserRepository        userRepository;
    private final AppConfig             appConfig;

    @Transactional
    public ReservationResponse reserve(String username, ReservationRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        Book book = bookRepository.findById(req.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Sách", req.getBookId()));

        if (book.getAvailableCopies() > 0)
            throw new BusinessException("Sách hiện còn bản sao, hãy mượn trực tiếp thay vì đặt trước.");

        boolean alreadyReserved = reservationRepository.existsByUserIdAndBookIdAndStatusIn(
                user.getId(), book.getId(),
                List.of(Reservation.ReservationStatus.WAITING, Reservation.ReservationStatus.READY));
        if (alreadyReserved)
            throw new BusinessException("Bạn đã đặt trước cuốn sách này rồi.");

        Reservation r = Reservation.builder()
                .user(user).book(book)
                .status(Reservation.ReservationStatus.WAITING)
                .build();
        return ReservationResponse.from(reservationRepository.save(r));
    }

    @Transactional
    public void cancel(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        Reservation r = reservationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đặt trước hoặc không có quyền"));
        if (r.getStatus() == Reservation.ReservationStatus.FULFILLED)
            throw new BusinessException("Đặt trước đã được thực hiện, không thể hủy.");
        r.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(r);
    }

    public PageResponse<ReservationResponse> getMyReservations(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        var pageable = PageRequest.of(page, size, Sort.by("reservedAt").descending());
        return new PageResponse<>(
            reservationRepository.findByUserIdOrderByReservedAtDesc(user.getId(), pageable)
                .map(ReservationResponse::from)
        );
    }

    public PageResponse<ReservationResponse> getAll(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("reservedAt").descending());
        return new PageResponse<>(reservationRepository.findAll(pageable).map(ReservationResponse::from));
    }

    // Scheduled: expire các reservation READY đã quá hạn
    @Scheduled(cron = "0 30 1 * * *") // 1:30 AM
    @Transactional
    public void expireReservations() {
        List<Reservation> expired = reservationRepository.findExpiredReservations(LocalDateTime.now());
        expired.forEach(r -> r.setStatus(Reservation.ReservationStatus.EXPIRED));
        reservationRepository.saveAll(expired);
        if (!expired.isEmpty())
            log.info("⏰ Đã expire {} reservation quá hạn", expired.size());
    }
}
