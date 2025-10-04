package com.example.demo.repository;

import com.example.demo.model.UserJobTemplateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserJobTemplateHistoryRepository extends JpaRepository<UserJobTemplateHistory, Long> {

    // 直近5件の履歴を取得
    List<UserJobTemplateHistory> findTop5ByUser_IdOrderBySelectedAtDesc(Long userId);
}
