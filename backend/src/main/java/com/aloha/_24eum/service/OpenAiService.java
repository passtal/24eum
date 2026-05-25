package com.aloha._24eum.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OpenAiService {

    private final String apiKey;
    private final String apiUrl;
    private final String model;
    private final RestClient client = RestClient.create();

    public OpenAiService(
            @Value("${openai.api.key:}") String apiKey,
            @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}") String apiUrl,
            @Value("${openai.api.model:gpt-4o-mini}") String model) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /** 채팅 형식으로 질의 → 응답 텍스트 반환 */
    @SuppressWarnings("unchecked")
    public String chat(String systemPrompt, String userPrompt) {
        if (!isConfigured()) {
            throw new IllegalStateException("OpenAI API key가 설정되지 않았습니다. application-secret.properties 에 openai.api.key 를 설정하세요.");
        }
        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.7,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                )
        );
        try {
            Map<String, Object> resp = client.post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            if (resp == null) return "";
            List<Map<String, Object>> choices = (List<Map<String, Object>>) resp.get("choices");
            if (choices == null || choices.isEmpty()) return "";
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return message == null ? "" : String.valueOf(message.get("content"));
        } catch (RestClientException e) {
            log.error("OpenAI 호출 실패", e);
            throw new IllegalStateException("AI 응답 생성에 실패했습니다: " + e.getMessage());
        }
    }

    public String getModel() { return model; }
}
