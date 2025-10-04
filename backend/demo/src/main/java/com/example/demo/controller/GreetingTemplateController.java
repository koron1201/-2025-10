package com.example.demo.controller;

import com.example.demo.dto.GreetingTemplateResponse;
import com.example.demo.service.GreetingTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class GreetingTemplateController {

    private final GreetingTemplateService service;

    @GetMapping("/greetings")
    public List<GreetingTemplateResponse> getGreetings(
            @RequestParam String season,
            @RequestParam String purpose
    ) {
        return service.getTemplates(season, purpose);
    }
}
