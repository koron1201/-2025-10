package com.example.demo.controller;

import com.example.demo.dto.SlackIntegrationRequest;
import com.example.demo.dto.SlackIntegrationResponse;
import com.example.demo.service.SlackService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final SlackService slackService;

    public TestController(SlackService slackService) {
        this.slackService = slackService;
    }

    @GetMapping("/slack-test")
    public String sendTestMessage() {
        SlackIntegrationRequest request = new SlackIntegrationRequest();
        request.setMessage(":white_check_mark: Hello from Spring Boot!");
        request.setChannelId("general");

        SlackIntegrationResponse response = slackService.sendMessage(request);
        return response.getStatus();
    }
}
