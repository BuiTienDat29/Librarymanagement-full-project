package com.library.service;

import com.library.config.JwtService;
import com.library.dto.request.*;
import com.library.dto.response.AuthResponse;
import com.library.dto.response.UserResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Role;
import com.library.model.User;
import com.library.repository.RoleRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository     userRepository;
    private final RoleRepository     roleRepository;
    private final JwtService         jwtService;
    private final PasswordEncoder    passwordEncoder;
    private final AuthenticationManager authManager;

    // ── Đăng ký ──────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra trùng username / email
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username '" + request.getUsername() + "' đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email '" + request.getEmail() + "' đã được sử dụng");
        }

        // Gán role STUDENT mặc định khi tự đăng ký
        Role role = roleRepository.findByName(Role.RoleName.STUDENT)
                .orElseThrow(() -> new ResourceNotFoundException("Role STUDENT chưa được khởi tạo trong DB"));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .studentId(request.getStudentId())
                .role(role)
                .isActive(true)
                .build();

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);

        userRepository.save(user);

        return AuthResponse.of(accessToken, refreshToken, UserResponse.from(user));
    }

    // ── Đăng nhập ─────────────────────────────────────────
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Spring Security tự throw BadCredentialsException nếu sai
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));

        if (!user.getIsActive()) {
            throw new BusinessException("Tài khoản đã bị vô hiệu hóa", HttpStatus.UNAUTHORIZED);
        }

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthResponse.of(accessToken, refreshToken, UserResponse.from(user));
    }

    // ── Refresh token ─────────────────────────────────────
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new BusinessException("Refresh token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED));

        // Validate token còn hạn không
        if (!jwtService.isTokenValid(request.getRefreshToken(), user)) {
            user.setRefreshToken(null);
            userRepository.save(user);
            throw new BusinessException("Refresh token đã hết hạn, vui lòng đăng nhập lại", HttpStatus.UNAUTHORIZED);
        }

        // Tạo cặp token mới (rotation)
        String newAccessToken  = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return AuthResponse.of(newAccessToken, newRefreshToken, UserResponse.from(user));
    }

    // ── Đăng xuất ─────────────────────────────────────────
    @Transactional
    public void logout(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }

    // ── Đổi mật khẩu ──────────────────────────────────────
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
