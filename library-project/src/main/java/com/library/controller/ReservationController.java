package com.library.controller;

import com.library.dto.request.ReservationRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.ReservationResponse;
import com.library.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> reserve(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReservationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.reserve(userDetails.getUsername(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        reservationService.cancel(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<PageResponse<ReservationResponse>> my(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reservationService.getMyReservations(userDetails.getUsername(), page, size));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<PageResponse<ReservationResponse>> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reservationService.getAll(page, size));
    }
}
