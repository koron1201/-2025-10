package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_greeting_history")
@Getter
@Setter
public class UserGreetingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;      // 実際のユーザーテーブルID
    private Long templateId;  // greeting_templateのID
    private LocalDateTime selectedAt;

    @PrePersist
    protected void onCreate() {
        selectedAt = LocalDateTime.now();
    }
}
