package com.example.controller;

import com.example.entity.Book;
import com.example.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookController {
    private final BookService bookService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", books);
        response.put("total", books.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookById(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id)
                    .orElseThrow(() -> new RuntimeException("书籍未找到"));
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", book);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchBooks(@RequestParam String keyword) {
        List<Book> books = bookService.searchBooks(keyword);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", books);
        response.put("total", books.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getBooksByStatus(@PathVariable String status) {
        List<Book> books = bookService.getBooksByStatus(status);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", books);
        response.put("total", books.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBook(@Valid @RequestBody Book book) {
        try {
            Book savedBook = bookService.createBook(book);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "书籍创建成功");
            response.put("data", savedBook);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody Book bookDetails) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "书籍更新成功");
            response.put("data", updatedBook);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "书籍删除成功"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/borrow")
    public ResponseEntity<Map<String, Object>> borrowBook(@PathVariable Long id) {
        try {
            Book book = bookService.borrowBook(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "借书成功");
            response.put("data", book);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Map<String, Object>> returnBook(@PathVariable Long id) {
        try {
            Book book = bookService.returnBook(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "还书成功");
            response.put("data", book);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
