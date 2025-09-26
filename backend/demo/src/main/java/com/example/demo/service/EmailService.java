package com.example.demo.service;

import com.example.demo.model.Email;
import com.example.demo.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final EmailRepository emailRepository;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .defaultHeader("Authorization", "Bearer " + System.getenv("OPENAI_API_KEY"))
            .build();

    public Email generateEmail(String keyword) {
        String prompt = "キーワード「" + keyword + "」をもとに、ビジネスメール本文を丁寧に作成してください。";

        String generatedText = webClient.post()
                .uri("/chat/completions")
                .bodyValue("""
                        {
                          "model": "gpt-4o-mini",
                          "messages": [{"role": "user", "content": "%s"}]
                        }
                        """.formatted(prompt))
                .retrieve()
                .bodyToMono(String.class)  // TODO: JSONから本文だけ抜き出す必要あり
                .block();

        Email email = new Email();
        email.setKeyword(keyword);
        email.setGeneratedText(generatedText);

        return emailRepository.save(email);
    }
}
