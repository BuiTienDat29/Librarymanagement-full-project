package com.library.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateUserRequest {
    @Size(max = 150)
    private String fullName;

    @Email
    private String email;

    private String phone;
    private String studentId;
    private Boolean isActive;
    private String roleName; // chỉ ADMIN được set
}
