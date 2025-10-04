package com.example.demo.controller;

import com.example.demo.dto.UserGreetingHistoryResponse;
import com.example.demo.service.UserGreetingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserGreetingHistoryController {

    private final UserGreetingHistoryService service;

    // テンプレート選択時に履歴を保存
    @PostMapping("/{userId}/greeting-template/{templateId}")
    public UserGreetingHistoryResponse selectTemplate(
            @PathVariable Long userId,
            @PathVariable Long templateId
    ) {
        return service.saveHistory(userId, templateId);
    }

    // 直近履歴取得
    @GetMapping("/{userId}/greeting-history")
    public List<UserGreetingHistoryResponse> getHistory(@PathVariable Long userId) {
        return service.getRecentHistory(userId);
    }
}
