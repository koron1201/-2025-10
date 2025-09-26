package com.example.demo.controller;

import com.example.demo.model.Email;
import com.example.demo.repository.EmailRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emails") // クラス単位でベースパス
public class EmailController {

    private final EmailRepository emailRepository;

    // コンストラクタでRepositoryを注入
    public EmailController(EmailRepository emailRepository) {
        this.emailRepository = emailRepository;
    }

    // GET /api/emails/all
    @GetMapping("/all")
    public List<Email> getAllEmails() {
        return emailRepository.findAll();
    }
}
