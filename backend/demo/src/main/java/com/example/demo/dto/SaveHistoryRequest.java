package com.example.demo.dto;

import lombok.Data;

@Data
public class SaveHistoryRequest {

    private String user;

    private String timestamp;

    private String subject;

    private String body;

}

