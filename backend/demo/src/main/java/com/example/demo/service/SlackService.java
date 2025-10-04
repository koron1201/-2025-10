package com.example.demo.service;

import com.example.demo.dto.SlackIntegrationRequest;
import com.example.demo.dto.SlackIntegrationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SlackService {

    @Value("${slack.token:}")
    private String slackToken;

    @Value("${slack.channel:}")
    private String defaultChannelId;

    private final RestTemplate restTemplate = new RestTemplate();

    public SlackIntegrationResponse sendMessage(SlackIntegrationRequest request) {
        SlackIntegrationResponse response = new SlackIntegrationResponse();

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("message は必須です");
            return response;
        }

        String channel = (request.getChannelId() == null || request.getChannelId().isBlank())
                ? defaultChannelId
                : request.getChannelId();

        if (channel == null || channel.isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("channelId が未指定で、デフォルトチャンネルも未設定です");
            return response;
        }

        if (slackToken == null || slackToken.isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("slack.token が未設定です");
            return response;
        }

        // Slack Web API へPOST
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(slackToken);

            Map<String, Object> body = new HashMap<>();
            body.put("channel", channel);
            body.put("text", request.getMessage());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> apiRes = restTemplate.postForObject(
                    "https://slack.com/api/chat.postMessage",
                    entity,
                    Map.class
            );

            boolean ok = apiRes != null && Boolean.TRUE.equals(apiRes.get("ok"));
            if (!ok) {
                response.setStatus("error");
                Object err = apiRes != null ? apiRes.get("error") : "unknown_error";
                response.setErrorMessage("Slack API error: " + String.valueOf(err));
                return response;
            }

            Object tsObj = apiRes.get("ts");
            response.setStatus("ok");
            response.setTs(tsObj != null ? String.valueOf(tsObj) : null);
            return response;
        } catch (RestClientException e) {
            response.setStatus("error");
            response.setErrorMessage("HTTP error: " + e.getMessage());
            return response;
        }
    }
}
