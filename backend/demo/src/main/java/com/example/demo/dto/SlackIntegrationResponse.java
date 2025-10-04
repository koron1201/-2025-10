package com.example.demo.dto;

import lombok.Data;

@Data
public class SlackIntegrationResponse {

    private String status;

    private String ts;

    private String errorMessage;
}

