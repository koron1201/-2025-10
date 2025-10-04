package com.example.demo.repository;

import com.example.demo.model.GreetingTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GreetingTemplateRepository extends JpaRepository<GreetingTemplate, Long> {

    // 季節と目的でフィルタ
    List<GreetingTemplate> findBySeasonAndPurpose(String season, String purpose);
}
