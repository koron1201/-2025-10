package com.example.demo.service;

import com.example.demo.dto.OutlookIntegrationRequest;
import com.example.demo.dto.OutlookIntegrationResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OutlookService {

    public OutlookIntegrationResponse sendMail(OutlookIntegrationRequest request) {
        OutlookIntegrationResponse response = new OutlookIntegrationResponse();

        if (request.getRecipient() == null || request.getRecipient().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("recipient は必須です");
            return response;
        }

        if (request.getSubject() == null || request.getSubject().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("subject は必須です");
            return response;
        }

        if (request.getBody() == null || request.getBody().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("body は必須です");
            return response;
        }

        response.setStatus("ok");
        response.setMessageId(UUID.randomUUID().toString());
        return response;
    }
}

