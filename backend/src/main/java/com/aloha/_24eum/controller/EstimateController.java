package com.aloha._24eum.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.EstimateRequest;
import com.aloha._24eum.dto.MatchingResult;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.EstimateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;

    @PostMapping
    public EstimateRequest create(@RequestBody EstimateRequest req,
                                  @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        req.setUserId(principal.getId());
        return estimateService.create(req);
    }

    @GetMapping("/{id}")
    public EstimateRequest get(@PathVariable Long id) { return estimateService.get(id); }

    @GetMapping("/{id}/matches")
    public List<MatchingResult> matches(@PathVariable Long id) { return estimateService.matches(id); }

    @PostMapping("/{id}/select/{cid}")
    public ResponseEntity<Void> select(@PathVariable Long id, @PathVariable Long cid,
                                       @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        // 단순 상태 변경: 선택한 업자가 있는 견적으로 표시
        estimateService.updateStatus(id, "IN_PROGRESS");
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        estimateService.updateStatus(id, body.get("status"));
        return ResponseEntity.noContent().build();
    }
}
