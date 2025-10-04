package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(length = 2000)
    private String refreshToken;

    @Column(length = 100)
    private String role; // 例: "admin", "user", "manager"

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // コンストラクタ（emailのみ）
    public User(String email) {
        this.email = email;
        this.createdAt = LocalDateTime.now();
    }

    // 更新日時の自動更新
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
