package com.example.demo.dto;

import lombok.Data;

@Data
public class OutlookIntegrationRequest {

    private String recipient;

    private String subject;

    private String body;
}

