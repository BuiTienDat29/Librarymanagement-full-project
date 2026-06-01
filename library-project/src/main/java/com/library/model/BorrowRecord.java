package com.library.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "borrow_records", indexes = {
    @Index(name = "idx_borrow_status",   columnList = "status"),
    @Index(name = "idx_borrow_due_date", columnList = "due_date")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "copy_id", nullable = false)
    private BookCopy bookCopy;

    @Column(name = "borrow_date", nullable = false)
    private LocalDate borrowDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BorrowStatus status = BorrowStatus.BORROWED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum BorrowStatus {
        BORROWED, RETURNED, OVERDUE, LOST
    }
}
