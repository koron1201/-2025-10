package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class ContextSuggestionResponse {

    private String subjectSuggestion;

    private String bodySuggestion;

    private List<String> tips;
}

