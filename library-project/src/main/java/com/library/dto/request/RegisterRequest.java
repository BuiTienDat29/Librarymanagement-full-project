package com.library.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 50, message = "Username phải từ 4-50 ký tự")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải ít nhất 6 ký tự")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private String phone;
    private String studentId;
}
