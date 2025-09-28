package com.example.demo.controller;

import com.example.demo.model.History;
import com.example.demo.repository.HistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryRepository historyRepository;

    public HistoryController(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    // 全履歴取得
    @GetMapping("/all")
    public List<History> getAllHistory() {
        return historyRepository.findAll();
    }

    // 履歴追加
    @PostMapping("/add")
    public History addHistory(@RequestBody History history) {
        return historyRepository.save(history);
    }
}
