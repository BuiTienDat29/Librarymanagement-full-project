package com.library.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChangePasswordRequest {
    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 6, message = "Mật khẩu mới phải ít nhất 6 ký tự")
    private String newPassword;
}
