package com.library.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class AppConfig {

    @Value("${app.library.max-borrow-limit}")
    private int maxBorrowLimit;

    @Value("${app.library.borrow-duration-days}")
    private int borrowDurationDays;

    @Value("${app.library.fine-per-day}")
    private long finePerDay;

    @Value("${app.library.reservation-hold-days}")
    private int reservationHoldDays;
}
