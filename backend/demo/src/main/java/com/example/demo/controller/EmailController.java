package com.example.demo.controller;

import com.example.demo.dto.GenerateEmailRequest;
import com.example.demo.dto.GenerateEmailResponse;
import com.example.demo.dto.SaveHistoryRequest;
import com.example.demo.dto.SaveHistoryResponse;
import com.example.demo.service.EmailService;
import com.example.demo.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/emails", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailGenerationService;
    private final HistoryService historyService;

    @PostMapping(value = "/generate", consumes = MediaType.APPLICATION_JSON_VALUE)
    public GenerateEmailResponse generateEmail(@RequestBody GenerateEmailRequest request) {
        return emailGenerationService.generateEmail(request);
    }

    @PostMapping(value = "/save", consumes = MediaType.APPLICATION_JSON_VALUE)
    public SaveHistoryResponse saveGeneratedEmail(@RequestBody SaveHistoryRequest request) {
        return historyService.saveHistory(request);
    }
}
