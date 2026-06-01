package com.library.exception;

import org.springframework.http.HttpStatus;

// ── Dùng cho lỗi nghiệp vụ: hết sách, vượt giới hạn, phạt chưa trả... ──
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    // Shortcut hay dùng nhất
    public BusinessException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public HttpStatus getStatus() {
        return status;
    }
}
