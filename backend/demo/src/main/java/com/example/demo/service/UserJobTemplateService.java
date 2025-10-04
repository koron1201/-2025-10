package com.example.demo.service;

import com.example.demo.dto.JobHistoryResponse;
import com.example.demo.model.AppUser;
import com.example.demo.model.JobTemplate;
import com.example.demo.model.UserJobTemplateHistory;
import com.example.demo.repository.AppUserRepository;
import com.example.demo.repository.JobTemplateRepository;
import com.example.demo.repository.UserJobTemplateHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserJobTemplateService {

    private final AppUserRepository appUserRepository;
    private final JobTemplateRepository jobTemplateRepository;
    private final UserJobTemplateHistoryRepository historyRepository;

    // ---------------------------------------
    // 1. 職種テンプレート選択＆履歴保存
    // ---------------------------------------
    @Transactional
    public void selectJobTemplate(Long userId, Long templateId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが存在しません"));

        JobTemplate template = jobTemplateRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("テンプレートが存在しません"));

        UserJobTemplateHistory history = new UserJobTemplateHistory();
        history.setUser(user);
        history.setJobTemplate(template);
        history.setSelectedAt(LocalDateTime.now());

        historyRepository.save(history);
    }

    // ---------------------------------------
    // 2. 直近5件の履歴取得
    // ---------------------------------------
    @Transactional(readOnly = true)
    public List<JobHistoryResponse> getRecentJobHistory(Long userId) {
        return historyRepository.findTop5ByUser_IdOrderBySelectedAtDesc(userId)
                .stream()
                .map(h -> new JobHistoryResponse(
                        h.getId(),
                        h.getJobTemplate().getJobType(),
                        h.getSelectedAt()
                ))
                .collect(Collectors.toList());
    }
}
