package com.example.demo.dto;

import lombok.Data;

@Data
public class SaveHistoryResponse {

    private String historyId;

    private boolean duplicate;

    private Double similarityScore;

    private String duplicateOfId;

    private String subject;

    private String body;

    private String user;

    private String timestamp;

    private String createdBy;
}

