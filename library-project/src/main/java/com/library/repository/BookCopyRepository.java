package com.library.repository;

import com.library.model.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {

    List<BookCopy> findByBookId(Long bookId);

    Optional<BookCopy> findByBarcode(String barcode);

    // Lấy 1 bản sao AVAILABLE để cho mượn (dùng LIMIT 1)
    @Query("""
        SELECT bc FROM BookCopy bc
        WHERE bc.book.id = :bookId
        AND   bc.status = 'AVAILABLE'
        ORDER BY bc.id ASC
    """)
    List<BookCopy> findAvailableCopiesByBookId(@Param("bookId") Long bookId);

    long countByBookIdAndStatus(Long bookId, BookCopy.CopyStatus status);
}
