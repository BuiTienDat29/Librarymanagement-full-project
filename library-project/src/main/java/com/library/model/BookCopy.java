package com.library.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "book_copies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookCopy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(unique = true, length = 50)
    private String barcode;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_condition", nullable = false, length = 20)
    @Builder.Default
    private Condition condition = Condition.NEW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CopyStatus status = CopyStatus.AVAILABLE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Condition {
        NEW, GOOD, DAMAGED, LOST
    }

    public enum CopyStatus {
        AVAILABLE, BORROWED, RESERVED, MAINTENANCE
    }
}
