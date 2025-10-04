package com.example.demo.dto;

import lombok.Data;

@Data
public class SlackIntegrationRequest {

    private String message;

    private String channelId;
}

