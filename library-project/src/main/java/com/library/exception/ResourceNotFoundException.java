package com.library.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super("Không tìm thấy " + resource + " với id: " + id);
    }
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
