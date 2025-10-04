package com.example.demo.controller;

import com.example.demo.dto.JobHistoryResponse;
import com.example.demo.service.UserJobTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserJobTemplateController {

    private final UserJobTemplateService service;

    // -------------------------------
    // 1. 職種テンプレート選択 & 履歴保存
    // -------------------------------
    @PostMapping("/{userId}/job-template/{templateId}")
    public void selectJobTemplate(
            @PathVariable Long userId,
            @PathVariable Long templateId
    ) {
        service.selectJobTemplate(userId, templateId);
    }

    // -------------------------------
    // 2. 直近5件の履歴取得
    // -------------------------------
    @GetMapping("/{userId}/job-template/history")
    public List<JobHistoryResponse> getRecentJobHistory(@PathVariable Long userId) {
        return service.getRecentJobHistory(userId);
    }
}
