package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "emails")
@Data
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyword;

    @Column(columnDefinition = "TEXT")
    private String generatedText;

    private LocalDateTime createdAt = LocalDateTime.now();
}
