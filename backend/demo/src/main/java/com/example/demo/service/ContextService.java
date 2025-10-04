package com.example.demo.service;

import com.example.demo.dto.ContextSuggestionRequest;
import com.example.demo.dto.ContextSuggestionResponse;
import com.example.demo.dto.ContextTemplate;
import com.example.demo.dto.ContextTemplateRequest;
import com.example.demo.dto.ContextTemplatesResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContextService {

    public ContextTemplatesResponse getTemplates(ContextTemplateRequest request) {
        List<ContextTemplate> templates = new ArrayList<>();
        String role = request.getJobRole() != null ? request.getJobRole().toLowerCase() : "";

        switch (role) {
            case "sales" -> {
                templates.add(new ContextTemplate("sales-1", "見積依頼", "【見積依頼】{商品名} の件", "見積依頼の本文テンプレート…"));
                templates.add(new ContextTemplate("sales-2", "ご提案フォロー", "先日のご提案の件", "ご提案フォローの本文テンプレート…"));
            }
            case "support" -> {
                templates.add(new ContextTemplate("support-1", "一次回答", "【ご連絡】お問い合わせの件", "一次回答の本文テンプレート…"));
                templates.add(new ContextTemplate("support-2", "解決報告", "【解決報告】事象の改善について", "解決報告の本文テンプレート…"));
            }
            case "hr" -> {
                templates.add(new ContextTemplate("hr-1", "面接案内", "面接日程のご案内", "面接案内の本文テンプレート…"));
                templates.add(new ContextTemplate("hr-2", "内定通知", "【重要】内定のご連絡", "内定通知の本文テンプレート…"));
            }
            default -> {
                templates.add(new ContextTemplate("dev-1", "リリース案内", "【リリース通知】{プロダクト名} v{バージョン}", "リリース案内の本文テンプレート…"));
                templates.add(new ContextTemplate("dev-2", "障害報告", "【障害報告】{サービス名}", "障害報告の本文テンプレート…"));
            }
        }

        return new ContextTemplatesResponse(templates);
    }

    public ContextSuggestionResponse suggest(ContextSuggestionRequest request) {
        String prefix = "";
        if (request.getSettings() != null) {
            String tone = request.getSettings().getTone();
            if (tone != null) {
                switch (tone.toLowerCase()) {
                    case "formal" -> prefix = "【整形案】";
                    case "friendly" -> prefix = "🙂 ";
                    default -> prefix = "";
                }
            }
        }

        String subjectSuggestion = request.getSubject();
        if (subjectSuggestion != null && !subjectSuggestion.isBlank()) {
            subjectSuggestion = prefix + subjectSuggestion;
        }

        String bodySuggestion = prefix + request.getBody() + "\n\n— コンテキスト考慮案";

        List<String> tips = List.of(
                "件名は要点を先頭に",
                "結論→理由→依頼の順で簡潔に",
                "職種に合わせた語彙を使用"
        );

        ContextSuggestionResponse response = new ContextSuggestionResponse();
        response.setSubjectSuggestion(subjectSuggestion);
        response.setBodySuggestion(bodySuggestion);
        response.setTips(tips);
        return response;
    }
}


