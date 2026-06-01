package com.library.controller;

import com.library.dto.response.FineResponse;
import com.library.dto.response.PageResponse;
import com.library.service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    @GetMapping("/my-fines")
    public ResponseEntity<PageResponse<FineResponse>> myFines(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(fineService.getMyFines(userDetails.getUsername(), page, size));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<PageResponse<FineResponse>> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(fineService.getAllFines(page, size));
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<FineResponse> pay(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.payFine(id));
    }

    @PutMapping("/{id}/waive")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<FineResponse> waive(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.waiveFine(id));
    }
}
