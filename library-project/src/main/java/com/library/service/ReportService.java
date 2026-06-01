package com.library.service;

import com.library.dto.response.BookResponse;
import com.library.dto.response.ReportSummaryResponse;
import com.library.model.BorrowRecord;
import com.library.model.Fine;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookRepository         bookRepository;
    private final BookCopyRepository     copyRepository;
    private final UserRepository         userRepository;
    private final BorrowRecordRepository borrowRepository;
    private final FineRepository         fineRepository;
    private final ReservationRepository  reservationRepository;

    public ReportSummaryResponse getSummary() {
        long totalBooks   = bookRepository.count();
        long totalCopies  = copyRepository.count();
        long totalUsers   = userRepository.count();
        long totalRes     = reservationRepository.count();

        long activeBorrows = borrowRepository
                .findByStatusOrderByBorrowDateDesc(BorrowRecord.BorrowStatus.BORROWED, PageRequest.of(0,1))
                .getTotalElements();
        long overdueCount  = borrowRepository
                .findByStatusOrderByBorrowDateDesc(BorrowRecord.BorrowStatus.OVERDUE, PageRequest.of(0,1))
                .getTotalElements();

        long availReal = bookRepository.findAll().stream()
                .mapToLong(b -> b.getAvailableCopies()).sum();

        BigDecimal totalPending = fineRepository.findAll().stream()
                .filter(f -> f.getStatus() == Fine.FineStatus.PENDING)
                .map(Fine::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReportSummaryResponse.builder()
                .totalBooks(totalBooks)
                .totalCopies(totalCopies)
                .availableCopies(availReal)
                .totalUsers(totalUsers)
                .activeBorrows(activeBorrows)
                .overdueCount(overdueCount)
                .totalPendingFines(totalPending)
                .totalReservations(totalRes)
                .build();
    }

    public long getBorrowStats(LocalDate from, LocalDate to) {
        return borrowRepository.countBorrowsInPeriod(from, to);
    }

    public List<BookResponse> getPopularBooks(int limit) {
        return bookRepository.findAll().stream()
                .sorted((a, b) -> (b.getTotalCopies() - b.getAvailableCopies())
                                - (a.getTotalCopies() - a.getAvailableCopies()))
                .limit(limit)
                .map(BookResponse::from)
                .collect(Collectors.toList());
    }
}
