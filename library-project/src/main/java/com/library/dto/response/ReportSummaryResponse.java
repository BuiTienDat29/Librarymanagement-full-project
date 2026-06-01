package com.library.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.List;

@Getter @Builder
public class ReportSummaryResponse {
    private long totalBooks;
    private long totalCopies;
    private long availableCopies;
    private long totalUsers;
    private long activeBorrows;
    private long overdueCount;
    private BigDecimal totalPendingFines;
    private long totalReservations;
}
