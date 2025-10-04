package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class GoogleCalendarIntegrationRequest {

    private String title;

    private String startIso;

    private String endIso;

    private List<String> attendees;

    private String description;
}

