package com.aloha._24eum.controller;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.AiSearchResponse;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.AiSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiSearchController {

    private final AiSearchService aiSearchService;

    @PostMapping("/search")
    public AiSearchResponse search(@RequestBody Map<String, String> body,
                                   @AuthenticationPrincipal CustomUserDetails principal) {
        Long userId = principal == null ? null : principal.getId();
        return aiSearchService.search(userId, body.get("query"));
    }

    @PostMapping("/recommend")
    public AiSearchResponse recommend(@RequestBody Map<String, String> body,
                                      @AuthenticationPrincipal CustomUserDetails principal) {
        Long userId = principal == null ? null : principal.getId();
        String prompt = "다음 조건에 맞는 시공업자를 추천해주세요: " + body.get("query");
        return aiSearchService.search(userId, prompt);
    }

    @PostMapping("/estimate")
    public AiSearchResponse estimate(@RequestBody Map<String, String> body,
                                     @AuthenticationPrincipal CustomUserDetails principal) {
        Long userId = principal == null ? null : principal.getId();
        String prompt = "다음 인테리어 조건의 예상 견적을 한국 시세 기준으로 알려주세요: " + body.get("query");
        return aiSearchService.search(userId, prompt);
    }
}
