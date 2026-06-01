package com.library.dto.response;

import com.library.model.Book;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @Builder
public class BookResponse {
    private Long id;
    private String title;
    private String isbn;
    private String author;
    private String publisher;
    private Integer publishedYear;
    private String categoryName;
    private Integer categoryId;
    private String description;
    private String coverImageUrl;
    private Integer totalCopies;
    private Integer availableCopies;
    private LocalDateTime createdAt;

    public static BookResponse from(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .isbn(book.getIsbn())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .publishedYear(book.getPublishedYear())
                .categoryId(book.getCategory() != null ? book.getCategory().getId() : null)
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .description(book.getDescription())
                .coverImageUrl(book.getCoverImageUrl())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .createdAt(book.getCreatedAt())
                .build();
    }
}
