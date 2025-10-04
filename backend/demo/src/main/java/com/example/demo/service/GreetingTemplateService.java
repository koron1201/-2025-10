package com.example.demo.service;

import com.example.demo.dto.GreetingTemplateResponse;
import com.example.demo.repository.GreetingTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GreetingTemplateService {

    private final GreetingTemplateRepository repository;

    public List<GreetingTemplateResponse> getTemplates(String season, String purpose) {
        return repository.findBySeasonAndPurpose(season, purpose)
                         .stream()
                         .map(t -> new GreetingTemplateResponse(t.getId(), t.getTitle(), t.getContent()))
                         .collect(Collectors.toList());
    }
}
