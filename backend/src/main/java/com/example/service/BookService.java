package com.example.service;

import com.example.entity.Book;
import com.example.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBooks();
        }
        return bookRepository.searchBooks(keyword.trim());
    }

    public List<Book> getBooksByStatus(String status) {
        return bookRepository.findByStatus(status);
    }

    @Transactional
    public Book createBook(Book book) {
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());
        if (book.getStatus() == null) {
            book.setStatus("available");
        }
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("书籍未找到: " + id));
        
        if (bookDetails.getTitle() != null) {
            book.setTitle(bookDetails.getTitle());
        }
        if (bookDetails.getAuthor() != null) {
            book.setAuthor(bookDetails.getAuthor());
        }
        if (bookDetails.getDescription() != null) {
            book.setDescription(bookDetails.getDescription());
        }
        if (bookDetails.getPublishYear() != null) {
            book.setPublishYear(bookDetails.getPublishYear());
        }
        if (bookDetails.getPrice() != null) {
            book.setPrice(bookDetails.getPrice());
        }
        if (bookDetails.getStatus() != null) {
            book.setStatus(bookDetails.getStatus());
        }
        if (bookDetails.getCoverUrl() != null) {
            book.setCoverUrl(bookDetails.getCoverUrl());
        }
        
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Transactional
    public Book borrowBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("书籍未找到: " + id));
        if (!"available".equals(book.getStatus())) {
            throw new RuntimeException("该书籍不可借用");
        }
        book.setStatus("borrowed");
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }

    @Transactional
    public Book returnBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("书籍未找到: " + id));
        book.setStatus("available");
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }
}
