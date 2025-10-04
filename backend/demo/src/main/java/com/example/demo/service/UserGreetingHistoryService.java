package com.example.demo.service;

import com.example.demo.dto.UserGreetingHistoryResponse;
import com.example.demo.model.GreetingTemplate;
import com.example.demo.model.UserGreetingHistory;
import com.example.demo.repository.GreetingTemplateRepository;
import com.example.demo.repository.UserGreetingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserGreetingHistoryService {

    private final UserGreetingHistoryRepository historyRepository;
    private final GreetingTemplateRepository templateRepository;

    // テンプレート選択時に履歴を保存
    public UserGreetingHistoryResponse saveHistory(Long userId, Long templateId) {
        UserGreetingHistory history = new UserGreetingHistory();
        history.setUserId(userId);
        history.setTemplateId(templateId);
        historyRepository.save(history);

        GreetingTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        return new UserGreetingHistoryResponse(
                history.getId(),
                template.getTitle(),
                template.getContent(),
                history.getSelectedAt()
        );
    }

    // 直近履歴取得（最大5件）
    public List<UserGreetingHistoryResponse> getRecentHistory(Long userId) {
        return historyRepository.findTop5ByUserIdOrderBySelectedAtDesc(userId)
                .stream()
                .map(h -> {
                    GreetingTemplate template = templateRepository.findById(h.getTemplateId())
                            .orElseThrow(() -> new RuntimeException("Template not found"));
                    return new UserGreetingHistoryResponse(
                            h.getId(),
                            template.getTitle(),
                            template.getContent(),
                            h.getSelectedAt()
                    );
                })
                .collect(Collectors.toList());
    }
}
