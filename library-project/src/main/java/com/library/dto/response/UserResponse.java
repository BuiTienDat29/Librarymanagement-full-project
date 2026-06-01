package com.library.dto.response;

import com.library.model.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String studentId;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .studentId(user.getStudentId())
                .role(user.getRole().getName().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
