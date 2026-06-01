package com.library.controller;

import com.library.dto.request.BorrowRequest;
import com.library.dto.response.BorrowResponse;
import com.library.dto.response.PageResponse;
import com.library.service.BorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping
    public ResponseEntity<BorrowResponse> borrow(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BorrowRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(borrowService.borrowBook(userDetails.getUsername(), req));
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @GetMapping("/my-history")
    public ResponseEntity<PageResponse<BorrowResponse>> myHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(borrowService.getMyHistory(userDetails.getUsername(), page, size));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<PageResponse<BorrowResponse>> active(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(borrowService.getActiveBorrows(page, size));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<PageResponse<BorrowResponse>> overdue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(borrowService.getOverdueBorrows(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.getById(id));
    }
}
