package com.example.demo.service;

import com.example.demo.dto.SaveHistoryRequest;
import com.example.demo.dto.SaveHistoryResponse;
import com.example.demo.dto.UpdateHistoryRequest;
import com.example.demo.model.History;
import com.example.demo.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HistoryService {

    private final HistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public List<SaveHistoryResponse> getAllHistory() {
        return historyRepository.findAll().stream()
                .sorted(Comparator.comparing(History::getTimestamp).reversed())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 重複チェックして保存
    public SaveHistoryResponse saveHistory(SaveHistoryRequest request) {
        History history = new History();
        history.setSubject(request.getSubject());
        history.setBody(request.getBody());
        history.setTimestamp(Optional.ofNullable(request.getTimestamp())
                .map(this::parseTimestamp)
                .orElse(LocalDateTime.now()));
        history.setCreatedBy(Optional.ofNullable(request.getUser()).orElse("anonymous"));

        historyRepository.findAll().stream()
                .filter(existing -> existing.getBody() != null)
                .map(existing -> Map.entry(existing, calculateSimilarity(history.getBody(), existing.getBody())))
                .filter(entry -> entry.getValue() != null && entry.getValue() > 0.8)
                .max(Map.Entry.comparingByValue())
                .ifPresent(entry -> {
                    history.setDuplicate(true);
                    history.setSimilarityScore(entry.getValue());
                    history.setDuplicateOfId(entry.getKey().getId());
                });

        History saved = historyRepository.save(history);
        return toResponse(saved);
    }

    public SaveHistoryResponse updateHistory(Long historyId, UpdateHistoryRequest request) {
        History history = historyRepository.findById(historyId)
                .orElseThrow(() -> new NoSuchElementException("History not found"));

        if (request.getSubject() != null) {
            history.setSubject(request.getSubject());
        }
        if (request.getBody() != null) {
            history.setBody(request.getBody());
        }
        if (request.getTimestamp() != null) {
            history.setTimestamp(parseTimestamp(request.getTimestamp()));
        }
        history.setCreatedBy(Optional.ofNullable(request.getUser()).orElse("anonymous"));
        if (request.getUser() != null) {
            history.setCreatedBy(request.getUser());
        }

        History saved = historyRepository.save(history);
        return toResponse(saved);
    }

    public void deleteHistory(Long historyId) {
        if (!historyRepository.existsById(historyId)) {
            throw new NoSuchElementException("History not found");
        }
        historyRepository.deleteById(historyId);
    }

    private SaveHistoryResponse toResponse(History history) {
        SaveHistoryResponse response = new SaveHistoryResponse();
        response.setHistoryId(String.valueOf(history.getId()));
        response.setSubject(history.getSubject());
        response.setBody(history.getBody());
        response.setTimestamp(Optional.ofNullable(history.getTimestamp()).map(LocalDateTime::toString).orElse(null));
        response.setUser(history.getCreatedBy());
        response.setCreatedBy(history.getCreatedBy());
        response.setDuplicate(history.isDuplicate());
        response.setSimilarityScore(history.getSimilarityScore());
        response.setDuplicateOfId(Optional.ofNullable(history.getDuplicateOfId()).map(String::valueOf).orElse(null));
        return response;
    }

    private Double calculateSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) {
            return null;
        }
        String normalized1 = text1.toLowerCase();
        String normalized2 = text2.toLowerCase();
        if (normalized1.equals(normalized2)) {
            return 1.0;
        }
        Set<String> words1 = new HashSet<>(Arrays.asList(normalized1.split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(normalized2.split("\\s+")));
        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);
        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);
        if (union.isEmpty()) {
            return 0.0;
        }
        return (double) intersection.size() / union.size();
    }

    private LocalDateTime parseTimestamp(String timestamp) {
        try {
            return OffsetDateTime.parse(timestamp)
                    .atZoneSameInstant(ZoneId.systemDefault())
                    .toLocalDateTime();
        } catch (Exception offsetParseException) {
            return LocalDateTime.parse(timestamp);
        }
    }

    // --- 追加: 職種別ユーザーのアクションを時間帯ごとに集計 ---
    @Transactional(readOnly = true)
    public Map<Integer, Long> countActionsByHour(String role) {
        return historyRepository.findAll().stream()
                .filter(h -> role.equalsIgnoreCase(h.getCreatedBy()))
                .map(h -> h.getTimestamp().getHour())
                .collect(Collectors.groupingBy(hour -> hour, Collectors.counting()));
    }
}