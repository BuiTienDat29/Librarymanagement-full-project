package com.library.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BookRequest {
    @NotBlank(message = "Tên sách không được để trống")
    @Size(max = 300)
    private String title;

    @Size(max = 20)
    private String isbn;

    @NotBlank(message = "Tác giả không được để trống")
    @Size(max = 200)
    private String author;

    @Size(max = 200)
    private String publisher;

    private Integer publishedYear;

    private Integer categoryId;

    private String description;

    private String coverImageUrl;

    @Min(value = 0, message = "Số lượng không được âm")
    private Integer totalCopies = 0;
}
