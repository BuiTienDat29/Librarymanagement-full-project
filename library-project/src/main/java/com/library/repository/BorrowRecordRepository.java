package com.library.repository;

import com.library.model.BorrowRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    // Lịch sử mượn của 1 user (có pagination)
    Page<BorrowRecord> findByUserIdOrderByBorrowDateDesc(Long userId, Pageable pageable);

    // Đếm số sách đang mượn của 1 user (chưa trả)
    long countByUserIdAndStatus(Long userId, BorrowRecord.BorrowStatus status);

    // Kiểm tra user đang mượn cuốn này chưa
    boolean existsByUserIdAndBookCopyIdAndStatus(Long userId, Long copyId, BorrowRecord.BorrowStatus status);

    // Lấy tất cả phiếu quá hạn (dùng cho scheduled job)
    @Query("""
        SELECT br FROM BorrowRecord br
        WHERE br.status = 'BORROWED'
        AND   br.dueDate < :today
    """)
    List<BorrowRecord> findAllOverdue(@Param("today") LocalDate today);

    // Danh sách đang mượn (LIBRARIAN xem)
    Page<BorrowRecord> findByStatusOrderByBorrowDateDesc(BorrowRecord.BorrowStatus status, Pageable pageable);

    // Thống kê mượn theo khoảng thời gian
    @Query("""
        SELECT COUNT(br) FROM BorrowRecord br
        WHERE br.borrowDate BETWEEN :from AND :to
    """)
    long countBorrowsInPeriod(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
