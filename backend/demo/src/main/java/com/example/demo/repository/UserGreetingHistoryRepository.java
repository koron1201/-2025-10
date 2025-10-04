package com.example.demo.repository;

import com.example.demo.model.UserGreetingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserGreetingHistoryRepository extends JpaRepository<UserGreetingHistory, Long> {

    // 直近の履歴を取得（最大5件）
    List<UserGreetingHistory> findTop5ByUserIdOrderBySelectedAtDesc(Long userId);
}
