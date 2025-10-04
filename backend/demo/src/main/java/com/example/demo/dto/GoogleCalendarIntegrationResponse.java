package com.example.demo.dto;

import lombok.Data;

@Data
public class GoogleCalendarIntegrationResponse {

    private String status;

    private String eventId;

    private String errorMessage;
}

