package com.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "书籍标题不能为空")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "作者不能为空")
    @Column(nullable = false, length = 100)
    private String author;

    @Column(length = 500)
    private String description;

    @NotNull(message = "出版年份不能为空")
    private Integer publishYear;

    @NotBlank(message = "ISBN不能为空")
    @Column(unique = true, length = 20)
    private String isbn;

    @Positive(message = "价格必须大于0")
    private Double price;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(name = "status")
    @Builder.Default
    private String status = "available"; // available, borrowed, damaged

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
