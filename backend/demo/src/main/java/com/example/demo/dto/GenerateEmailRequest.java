package com.example.demo.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GenerateEmailRequest {

    private List<String> keywords = new ArrayList<>();

    private String recipient;
}

