package com.example.demo.dto;

import java.time.LocalDateTime;

public class JobHistoryResponse {

    private Long historyId;
    private String jobName;
    private LocalDateTime selectedAt;

    public JobHistoryResponse(Long historyId, String jobName, LocalDateTime selectedAt) {
        this.historyId = historyId;
        this.jobName = jobName;
        this.selectedAt = selectedAt;
    }

    // getter
    public Long getHistoryId() { return historyId; }
    public String getJobName() { return jobName; }
    public LocalDateTime getSelectedAt() { return selectedAt; }
}
