package com.library.repository;

import com.library.model.Fine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    Page<Fine> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Fine> findByBorrowRecordId(Long borrowRecordId);

    // Kiểm tra user có phạt chưa thanh toán không (chặn mượn thêm)
    boolean existsByUserIdAndStatus(Long userId, Fine.FineStatus status);

    // Tổng tiền phạt chưa trả của 1 user
    @Query("""
        SELECT COALESCE(SUM(f.amount), 0) FROM Fine f
        WHERE f.user.id = :userId AND f.status = 'PENDING'
    """)
    BigDecimal sumPendingFineByUserId(@Param("userId") Long userId);
}
