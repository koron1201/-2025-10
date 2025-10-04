package com.example.demo.dto;

import lombok.Data;

@Data
public class OutlookIntegrationResponse {

    private String status;

    private String messageId;

    private String errorMessage;
}

