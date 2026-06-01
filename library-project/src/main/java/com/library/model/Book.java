package com.library.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "books", indexes = {
    @Index(name = "idx_book_title", columnList = "title"),
    @Index(name = "idx_book_isbn",  columnList = "isbn")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(unique = true, length = 20)
    private String isbn;

    @Column(nullable = false, length = 200)
    private String author;

    @Column(length = 200)
    private String publisher;

    @Column(name = "published_year")
    private Integer publishedYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "total_copies", nullable = false)
    @Builder.Default
    private Integer totalCopies = 0;

    @Column(name = "available_copies", nullable = false)
    @Builder.Default
    private Integer availableCopies = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
