package com.library.dto.response;

import com.library.model.BookCopy;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter @Builder
public class BookCopyResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String barcode;
    private String condition;
    private String status;
    private LocalDateTime createdAt;

    public static BookCopyResponse from(BookCopy copy) {
        return BookCopyResponse.builder()
                .id(copy.getId())
                .bookId(copy.getBook().getId())
                .bookTitle(copy.getBook().getTitle())
                .barcode(copy.getBarcode())
                .condition(copy.getCondition().name())
                .status(copy.getStatus().name())
                .createdAt(copy.getCreatedAt())
                .build();
    }
}
