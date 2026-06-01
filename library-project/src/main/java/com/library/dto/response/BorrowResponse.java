package com.library.dto.response;

import com.library.model.BorrowRecord;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter @Builder
public class BorrowResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String username;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String barcode;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;
    private String notes;
    private boolean overdue;

    public static BorrowResponse from(BorrowRecord r) {
        return BorrowResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userFullName(r.getUser().getFullName())
                .username(r.getUser().getUsername())
                .bookId(r.getBookCopy().getBook().getId())
                .bookTitle(r.getBookCopy().getBook().getTitle())
                .bookAuthor(r.getBookCopy().getBook().getAuthor())
                .barcode(r.getBookCopy().getBarcode())
                .borrowDate(r.getBorrowDate())
                .dueDate(r.getDueDate())
                .returnDate(r.getReturnDate())
                .status(r.getStatus().name())
                .notes(r.getNotes())
                .overdue(r.getReturnDate() == null && LocalDate.now().isAfter(r.getDueDate()))
                .build();
    }
}
