package com.library.dto.response;

import com.library.model.Reservation;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter @Builder
public class ReservationResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;
    private String status;

    public static ReservationResponse from(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userFullName(r.getUser().getFullName())
                .bookId(r.getBook().getId())
                .bookTitle(r.getBook().getTitle())
                .bookAuthor(r.getBook().getAuthor())
                .reservedAt(r.getReservedAt())
                .expiresAt(r.getExpiresAt())
                .status(r.getStatus().name())
                .build();
    }
}
