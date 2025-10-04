package com.example.demo.repository;

import com.example.demo.model.JobTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobTemplateRepository extends JpaRepository<JobTemplate, Long> {
    // 職種ごとのテンプレート一覧を取得
    List<JobTemplate> findByJobType(String jobType);
}
