package com.example.demo.service;

import com.example.demo.model.History;
import com.example.demo.repository.HistoryRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class HistoryAnalysisService {

    private final HistoryRepository historyRepository;

    public HistoryAnalysisService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    /**
     * 職種ごとの action 件数を集計
     */
    public Map<String, Long> countActionsByRole(String role) {
        List<History> histories = historyRepository.findAll().stream()
                .filter(h -> role.equalsIgnoreCase(h.getCreatedBy()))
                .collect(Collectors.toList());

        return histories.stream()
                .collect(Collectors.groupingBy(History::getSubject, Collectors.counting()));
    }

    /**
     * 職種ごとの時間帯別 action 件数
     */
    public Map<Integer, Long> countActionsByHour(String role) {
        return historyRepository.findAll().stream()
                .filter(h -> role.equalsIgnoreCase(h.getCreatedBy()))
                .map(h -> h.getTimestamp().getHour())
                .collect(Collectors.groupingBy(hour -> hour, Collectors.counting()));
    }
}
