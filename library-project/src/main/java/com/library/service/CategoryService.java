package com.library.service;

import com.library.dto.request.CategoryRequest;
import com.library.dto.response.CategoryResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Category;
import com.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::from).collect(Collectors.toList());
    }

    public CategoryResponse getById(Integer id) {
        return CategoryResponse.from(findOrThrow(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.existsByName(req.getName()))
            throw new BusinessException("Danh mục '" + req.getName() + "' đã tồn tại");

        Category c = Category.builder().name(req.getName()).description(req.getDescription()).build();
        return CategoryResponse.from(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse update(Integer id, CategoryRequest req) {
        Category c = findOrThrow(id);
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        return CategoryResponse.from(categoryRepository.save(c));
    }

    @Transactional
    public void delete(Integer id) {
        categoryRepository.delete(findOrThrow(id));
    }

    private Category findOrThrow(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", Long.valueOf(id)));
    }
}
