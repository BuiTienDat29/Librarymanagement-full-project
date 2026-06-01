package com.library.service;

import com.library.dto.request.BookCopyRequest;
import com.library.dto.request.BookRequest;
import com.library.dto.response.BookCopyResponse;
import com.library.dto.response.BookResponse;
import com.library.dto.response.PageResponse;
import com.library.exception.BusinessException;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Book;
import com.library.model.BookCopy;
import com.library.model.Category;
import com.library.repository.BookCopyRepository;
import com.library.repository.BookRepository;
import com.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository     bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final CategoryRepository categoryRepository;

    // ── Danh sách sách có search + filter + pagination ────
    public PageResponse<BookResponse> getBooks(String keyword, Integer categoryId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return new PageResponse<>(
            bookRepository.searchBooks(keyword, categoryId, pageable).map(BookResponse::from)
        );
    }

    public BookResponse getById(Long id) {
        return BookResponse.from(findOrThrow(id));
    }

    // ── Thêm sách mới ─────────────────────────────────────
    @Transactional
    public BookResponse create(BookRequest req) {
        if (req.getIsbn() != null && bookRepository.existsByIsbn(req.getIsbn()))
            throw new BusinessException("ISBN '" + req.getIsbn() + "' đã tồn tại");

        Book book = Book.builder()
                .title(req.getTitle())
                .isbn(req.getIsbn())
                .author(req.getAuthor())
                .publisher(req.getPublisher())
                .publishedYear(req.getPublishedYear())
                .description(req.getDescription())
                .coverImageUrl(req.getCoverImageUrl())
                .totalCopies(0)
                .availableCopies(0)
                .build();

        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", Long.valueOf(req.getCategoryId())));
            book.setCategory(cat);
        }

        return BookResponse.from(bookRepository.save(book));
    }

    // ── Cập nhật sách ─────────────────────────────────────
    @Transactional
    public BookResponse update(Long id, BookRequest req) {
        Book book = findOrThrow(id);
        book.setTitle(req.getTitle());
        book.setIsbn(req.getIsbn());
        book.setAuthor(req.getAuthor());
        book.setPublisher(req.getPublisher());
        book.setPublishedYear(req.getPublishedYear());
        book.setDescription(req.getDescription());
        book.setCoverImageUrl(req.getCoverImageUrl());

        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", Long.valueOf(req.getCategoryId())));
            book.setCategory(cat);
        } else {
            book.setCategory(null);
        }
        return BookResponse.from(bookRepository.save(book));
    }

    // ── Xóa sách ──────────────────────────────────────────
    @Transactional
    public void delete(Long id) {
        Book book = findOrThrow(id);
        if (book.getAvailableCopies() < book.getTotalCopies())
            throw new BusinessException("Không thể xóa sách đang có bản sao đang được mượn");
        bookRepository.delete(book);
    }

    // ── Quản lý bản sao (copies) ──────────────────────────
    public List<BookCopyResponse> getCopies(Long bookId) {
        findOrThrow(bookId);
        return bookCopyRepository.findByBookId(bookId).stream()
                .map(BookCopyResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public BookCopyResponse addCopy(Long bookId, BookCopyRequest req) {
        Book book = findOrThrow(bookId);

        if (bookCopyRepository.findByBarcode(req.getBarcode()).isPresent())
            throw new BusinessException("Barcode '" + req.getBarcode() + "' đã tồn tại");

        BookCopy copy = BookCopy.builder()
                .book(book)
                .barcode(req.getBarcode())
                .condition(req.getCondition())
                .status(BookCopy.CopyStatus.AVAILABLE)
                .build();
        bookCopyRepository.save(copy);

        // Đồng bộ số lượng
        book.setTotalCopies(book.getTotalCopies() + 1);
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return BookCopyResponse.from(copy);
    }

    @Transactional
    public BookCopyResponse updateCopyStatus(Long copyId, BookCopy.CopyStatus newStatus) {
        BookCopy copy = bookCopyRepository.findById(copyId)
                .orElseThrow(() -> new ResourceNotFoundException("Bản sao sách", copyId));
        copy.setStatus(newStatus);
        return BookCopyResponse.from(bookCopyRepository.save(copy));
    }

    private Book findOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sách", id));
    }
}
