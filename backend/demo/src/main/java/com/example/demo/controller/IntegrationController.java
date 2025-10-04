package com.example.demo.controller;

import com.example.demo.dto.GoogleCalendarIntegrationRequest;
import com.example.demo.dto.GoogleCalendarIntegrationResponse;
import com.example.demo.dto.OutlookIntegrationRequest;
import com.example.demo.dto.OutlookIntegrationResponse;
import com.example.demo.dto.SlackIntegrationRequest;
import com.example.demo.dto.SlackIntegrationResponse;
import com.example.demo.service.GoogleCalendarService;
import com.example.demo.service.OutlookService;
import com.example.demo.service.SlackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/integrations", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class IntegrationController {

    private final SlackService slackService;
    private final OutlookService outlookService;
    private final GoogleCalendarService googleCalendarService;

    @PostMapping("/slack")
    public SlackIntegrationResponse sendSlack(@RequestBody SlackIntegrationRequest request) {
        return slackService.sendMessage(request);
    }

    @PostMapping("/outlook")
    public OutlookIntegrationResponse sendOutlook(@RequestBody OutlookIntegrationRequest request) {
        return outlookService.sendMail(request);
    }

    @PostMapping("/google-calendar")
    public GoogleCalendarIntegrationResponse createCalendar(@RequestBody GoogleCalendarIntegrationRequest request) {
        return googleCalendarService.createEvent(request);
    }
}

