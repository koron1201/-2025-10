package com.example.demo.dto;

import java.time.LocalDateTime;

public class UserGreetingHistoryResponse {
    private Long historyId;
    private String title;
    private String content;
    private LocalDateTime selectedAt;

    public UserGreetingHistoryResponse(Long historyId, String title, String content, LocalDateTime selectedAt) {
        this.historyId = historyId;
        this.title = title;
        this.content = content;
        this.selectedAt = selectedAt;
    }

    public Long getHistoryId() { return historyId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getSelectedAt() { return selectedAt; }
}
