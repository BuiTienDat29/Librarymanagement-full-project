package com.library.repository;

import com.library.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Page<Reservation> findByUserIdOrderByReservedAtDesc(Long userId, Pageable pageable);

    // Kiểm tra user đã đặt cuốn này chưa (tránh đặt 2 lần)
    boolean existsByUserIdAndBookIdAndStatusIn(Long userId, Long bookId, List<Reservation.ReservationStatus> statuses);

    // Lấy người đặt đầu tiên (WAITING, theo thứ tự đặt) khi có sách trả về
    @Query("""
        SELECT r FROM Reservation r
        WHERE r.book.id = :bookId
        AND   r.status = 'WAITING'
        ORDER BY r.reservedAt ASC
    """)
    List<Reservation> findWaitingByBookIdOrderByDate(@Param("bookId") Long bookId);

    // Tìm các reservation READY đã hết hạn (để scheduled job expire)
    @Query("""
        SELECT r FROM Reservation r
        WHERE r.status = 'READY'
        AND   r.expiresAt < :now
    """)
    List<Reservation> findExpiredReservations(@Param("now") LocalDateTime now);

    Optional<Reservation> findByIdAndUserId(Long id, Long userId);
}
