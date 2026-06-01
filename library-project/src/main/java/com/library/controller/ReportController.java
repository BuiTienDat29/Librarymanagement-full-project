package com.library.controller;

import com.library.dto.response.BookResponse;
import com.library.dto.response.ReportSummaryResponse;
import com.library.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryResponse> summary() {
        return ResponseEntity.ok(reportService.getSummary());
    }

    @GetMapping("/borrow-stats")
    public ResponseEntity<Map<String, Long>> borrowStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(Map.of("count", reportService.getBorrowStats(from, to)));
    }

    @GetMapping("/popular-books")
    public ResponseEntity<List<BookResponse>> popularBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportService.getPopularBooks(limit));
    }
}
