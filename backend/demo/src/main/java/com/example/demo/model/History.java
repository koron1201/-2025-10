package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private LocalDateTime timestamp = LocalDateTime.now(); // 履歴発生時刻

    @Column(name = "created_by")
    private String createdBy;  // 保存したユーザー名/表示名

    private boolean duplicate;     // 重複フラグ

    private Double similarityScore;    // 類似度

    private Long duplicateOfId;        // 重複元ID
}
