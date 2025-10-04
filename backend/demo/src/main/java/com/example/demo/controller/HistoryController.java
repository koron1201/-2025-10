package com.example.demo.controller;

import com.example.demo.dto.SaveHistoryRequest;
import com.example.demo.dto.SaveHistoryResponse;
import com.example.demo.dto.UpdateHistoryRequest;
import com.example.demo.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    // 全履歴取得
    @GetMapping("/all")
    public List<SaveHistoryResponse> getAllHistory() {
        return historyService.getAllHistory();
    }

    // 履歴追加（重複チェックあり）
    @PostMapping("/add")
    public ResponseEntity<SaveHistoryResponse> addHistory(@RequestBody SaveHistoryRequest request) {
        SaveHistoryResponse response = historyService.saveHistory(request);
        return ResponseEntity.status(CREATED).body(response);
    }

    @PutMapping("/{historyId}")
    public SaveHistoryResponse updateHistory(@PathVariable Long historyId,
                                             @RequestBody UpdateHistoryRequest request) {
        return historyService.updateHistory(historyId, request);
    }

    @DeleteMapping("/{historyId}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long historyId) {
        historyService.deleteHistory(historyId);
        return ResponseEntity.noContent().build();
    }
}
