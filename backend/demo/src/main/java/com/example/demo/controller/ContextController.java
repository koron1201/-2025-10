package com.example.demo.controller;

import com.example.demo.dto.ContextSuggestionRequest;
import com.example.demo.dto.ContextSuggestionResponse;
import com.example.demo.dto.ContextTemplateRequest;
import com.example.demo.dto.ContextTemplatesResponse;
import com.example.demo.service.ContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/context", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class ContextController {

    private final ContextService contextService;

    @PostMapping("/templates")
    public ContextTemplatesResponse getTemplates(@RequestBody ContextTemplateRequest request) {
        return contextService.getTemplates(request);
    }

    @PostMapping("/suggest")
    public ContextSuggestionResponse suggest(@RequestBody ContextSuggestionRequest request) {
        return contextService.suggest(request);
    }
}

