package com.library.service;

import com.library.dto.response.FineResponse;
import com.library.dto.response.PageResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Fine;
import com.library.repository.FineRepository;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    public PageResponse<FineResponse> getMyFines(String username, int page, int size) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return new PageResponse<>(
            fineRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable).map(FineResponse::from)
        );
    }

    public PageResponse<FineResponse> getAllFines(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return new PageResponse<>(fineRepository.findAll(pageable).map(FineResponse::from));
    }

    @Transactional
    public FineResponse payFine(Long fineId) {
        Fine fine = findOrThrow(fineId);
        if (fine.getStatus() != Fine.FineStatus.PENDING)
            throw new BusinessException("Phiếu phạt này đã được xử lý rồi.");
        fine.setStatus(Fine.FineStatus.PAID);
        fine.setPaidAt(LocalDateTime.now());
        return FineResponse.from(fineRepository.save(fine));
    }

    @Transactional
    public FineResponse waiveFine(Long fineId) {
        Fine fine = findOrThrow(fineId);
        if (fine.getStatus() != Fine.FineStatus.PENDING)
            throw new BusinessException("Phiếu phạt này đã được xử lý rồi.");
        fine.setStatus(Fine.FineStatus.WAIVED);
        return FineResponse.from(fineRepository.save(fine));
    }

    private Fine findOrThrow(Long id) {
        return fineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phiếu phạt", id));
    }
}
