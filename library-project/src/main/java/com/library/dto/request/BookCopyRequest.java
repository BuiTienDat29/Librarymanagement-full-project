package com.library.dto.request;

import com.library.model.BookCopy;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BookCopyRequest {
    @NotBlank(message = "Barcode không được để trống")
    private String barcode;

    private BookCopy.Condition condition = BookCopy.Condition.NEW;
}
