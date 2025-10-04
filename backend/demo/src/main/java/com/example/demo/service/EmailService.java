package com.example.demo.service;

import com.example.demo.dto.GenerateEmailRequest;
import com.example.demo.dto.GenerateEmailResponse;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public GenerateEmailResponse generateEmail(GenerateEmailRequest request) {
        String subject = String.join("・", request.getKeywords());
        if (subject.isBlank()) {
            subject = "ご連絡";
        } else {
            subject = "【AI生成】" + subject + " の件";
        }

        String recipientLine = request.getRecipient() != null && !request.getRecipient().isBlank()
                ? request.getRecipient() + " 様\n\n"
                : "";

        String bulletLines = request.getKeywords().stream()
                .map(k -> "- " + k)
                .reduce((a, b) -> a + "\n" + b)
                .orElse("- (キーワード未入力)");

        String body = recipientLine + "いつもお世話になっております。\n\n"
                + "以下の内容につきましてご連絡差し上げます。\n"
                + bulletLines
                + "\n\nご確認のほど、よろしくお願いいたします。";

        return new GenerateEmailResponse(subject, body);
    }
}
