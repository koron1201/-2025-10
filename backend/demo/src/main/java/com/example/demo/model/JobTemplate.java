package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "job_template")
public class JobTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jobType;  // 職種（セールス、人事など）

    @Column(nullable = false)
    private String templateName;

    @Column(columnDefinition = "TEXT")
    private String content;

    // 履歴に使われる
    @OneToMany(mappedBy = "jobTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserJobTemplateHistory> histories;

    // getter/setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<UserJobTemplateHistory> getHistories() {
        return histories;
    }

    public void setHistories(List<UserJobTemplateHistory> histories) {
        this.histories = histories;
    }
}
