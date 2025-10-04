package com.example.demo.dto;

import lombok.Data;

@Data
public class UpdateHistoryRequest {

    private String subject;

    private String body;

    private String user;

    private String timestamp;
}


