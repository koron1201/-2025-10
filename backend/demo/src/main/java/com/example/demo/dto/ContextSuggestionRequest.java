package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class ContextSuggestionRequest {

    private SuggestionSettings settings;

    private String subject;

    private String body;

    private List<String> historySample;

    @Data
    public static class SuggestionSettings {
        private String jobRole;
        private String tone;
        private String department;
        private String companyStyle;
    }
}

