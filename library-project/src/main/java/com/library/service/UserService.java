package com.library.service;

import com.library.dto.request.UpdateUserRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.UserResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Role;
import com.library.model.User;
import com.library.repository.RoleRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public PageResponse<UserResponse> getAll(String keyword, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return new PageResponse<>(userRepository.searchUsers(keyword, pageable).map(UserResponse::from));
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(findOrThrow(id));
    }

    public UserResponse getProfile(String username) {
        return UserResponse.from(userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user")));
    }

    @Transactional
    public UserResponse updateProfile(String username, UpdateUserRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        applyUpdates(user, req, false);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse adminUpdate(Long id, UpdateUserRequest req) {
        User user = findOrThrow(id);
        applyUpdates(user, req, true);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void deactivate(Long id) {
        User user = findOrThrow(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    private void applyUpdates(User user, UpdateUserRequest req, boolean isAdmin) {
        if (req.getFullName() != null)  user.setFullName(req.getFullName());
        if (req.getPhone() != null)     user.setPhone(req.getPhone());
        if (req.getStudentId() != null) user.setStudentId(req.getStudentId());
        if (req.getEmail() != null) {
            if (!req.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(req.getEmail()))
                throw new BusinessException("Email đã được sử dụng bởi tài khoản khác.");
            user.setEmail(req.getEmail());
        }
        if (isAdmin) {
            if (req.getIsActive() != null)  user.setIsActive(req.getIsActive());
            if (req.getRoleName() != null) {
                Role role = roleRepository.findByName(Role.RoleName.valueOf(req.getRoleName()))
                        .orElseThrow(() -> new BusinessException("Role không hợp lệ: " + req.getRoleName()));
                user.setRole(role);
            }
        }
    }

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", id));
    }
}
