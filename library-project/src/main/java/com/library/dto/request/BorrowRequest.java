package com.library.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BorrowRequest {
    @NotNull(message = "Mã sách không được để trống")
    private Long bookId;

    private String notes;
}
