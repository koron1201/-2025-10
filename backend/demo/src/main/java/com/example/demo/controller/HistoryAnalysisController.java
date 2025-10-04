package com.example.demo.controller;

import com.example.demo.service.HistoryAnalysisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class HistoryAnalysisController {

    private final HistoryAnalysisService analysisService;

    public HistoryAnalysisController(HistoryAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    // 職種ごとの action 件数
    @GetMapping("/actionsByRole")
    public Map<String, Long> getActionsByRole(@RequestParam String role) {
        return analysisService.countActionsByRole(role);
    }

    // 職種ごとの時間帯別 action 件数
    @GetMapping("/actionsByHour")
    public Map<Integer, Long> getActionsByHour(@RequestParam String role) {
        return analysisService.countActionsByHour(role);
    }
}
