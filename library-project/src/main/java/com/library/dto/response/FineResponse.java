package com.library.dto.response;

import com.library.model.Fine;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Builder
public class FineResponse {
    private Long id;
    private Long borrowRecordId;
    private Long userId;
    private String userFullName;
    private String bookTitle;
    private Integer daysOverdue;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public static FineResponse from(Fine f) {
        return FineResponse.builder()
                .id(f.getId())
                .borrowRecordId(f.getBorrowRecord().getId())
                .userId(f.getUser().getId())
                .userFullName(f.getUser().getFullName())
                .bookTitle(f.getBorrowRecord().getBookCopy().getBook().getTitle())
                .daysOverdue(f.getDaysOverdue())
                .amount(f.getAmount())
                .status(f.getStatus().name())
                .paidAt(f.getPaidAt())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
