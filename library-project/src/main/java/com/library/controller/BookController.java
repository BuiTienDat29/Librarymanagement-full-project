package com.library.controller;

import com.library.dto.request.BookCopyRequest;
import com.library.dto.request.BookRequest;
import com.library.dto.response.*;
import com.library.model.BookCopy;
import com.library.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<PageResponse<BookResponse>> getBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(bookService.getBooks(keyword, categoryId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<BookResponse> update(@PathVariable Long id, @Valid @RequestBody BookRequest req) {
        return ResponseEntity.ok(bookService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Book Copies ───────────────────────────────────────
    @GetMapping("/{id}/copies")
    public ResponseEntity<List<BookCopyResponse>> getCopies(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getCopies(id));
    }

    @PostMapping("/{id}/copies")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<BookCopyResponse> addCopy(
            @PathVariable Long id, @Valid @RequestBody BookCopyRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.addCopy(id, req));
    }

    @PutMapping("/copies/{copyId}/status")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<BookCopyResponse> updateCopyStatus(
            @PathVariable Long copyId, @RequestParam BookCopy.CopyStatus status) {
        return ResponseEntity.ok(bookService.updateCopyStatus(copyId, status));
    }
}
