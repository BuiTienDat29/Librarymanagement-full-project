package com.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Validation lỗi (@Valid) ───────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field   = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(field, message);
        });
        return ResponseEntity.badRequest().body(
            ErrorResponse.builder()
                .status(400)
                .message("Dữ liệu không hợp lệ")
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    // ── Business logic lỗi ───────────────────────────────
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(ex.getStatus()).body(
            ErrorResponse.builder()
                .status(ex.getStatus().value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    // ── Resource không tìm thấy ───────────────────────────
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse.builder()
                .status(404)
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    // ── Sai mật khẩu ─────────────────────────────────────
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ErrorResponse.builder()
                .status(401)
                .message("Tên đăng nhập hoặc mật khẩu không đúng")
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    // ── Không có quyền ───────────────────────────────────
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ErrorResponse.builder()
                .status(403)
                .message("Bạn không có quyền thực hiện thao tác này")
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    // ── Lỗi chung ─────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ErrorResponse.builder()
                .status(500)
                .message("Lỗi hệ thống: " + ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build()
        );
    }

    // ── Error response shape ──────────────────────────────
    @lombok.Builder
    @lombok.Getter
    public static class ErrorResponse {
        private int status;
        private String message;
        private Map<String, String> errors;
        private LocalDateTime timestamp;
    }
}
