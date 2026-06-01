package com.library.repository;

import com.library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbn(String isbn);

    @Query("""
        SELECT b FROM Book b
        LEFT JOIN b.category c
        WHERE (:keyword IS NULL OR
               LOWER(b.title)  LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(b.isbn)   LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND   (:categoryId IS NULL OR c.id = :categoryId)
    """)
    Page<Book> searchBooks(
        @Param("keyword")    String keyword,
        @Param("categoryId") Integer categoryId,
        Pageable pageable
    );
}
