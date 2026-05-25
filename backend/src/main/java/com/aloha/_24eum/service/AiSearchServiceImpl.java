package com.aloha._24eum.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.AiSearchLogMapper;
import com.aloha._24eum.dto.AiSearchLog;
import com.aloha._24eum.dto.AiSearchResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiSearchServiceImpl implements AiSearchService {

    private static final String SYSTEM_PROMPT = """
            당신은 인테리어 매칭 플랫폼 '24이음'의 AI 어시스턴트입니다.
            사용자에게 인테리어 디자인/시공 자재/예상 견적/시공 시 주의사항을 친절하고 구체적으로 한국어로 안내합니다.
            긴 응답은 마크다운 목록 형식으로 정리합니다.
            """;

    private final OpenAiService openAi;
    private final AiSearchLogMapper logMapper;

    @Override
    @Transactional
    public AiSearchResponse search(Long userId, String query) {
        if (query == null || query.isBlank())
            throw new IllegalArgumentException("질문을 입력해주세요.");

        String answer = openAi.chat(SYSTEM_PROMPT, query);

        AiSearchLog log = AiSearchLog.builder()
                .userId(userId)
                .query(query)
                .response(answer)
                .build();
        logMapper.insert(log);

        return AiSearchResponse.builder()
                .query(query)
                .response(answer)
                .model(openAi.getModel())
                .createdAt(LocalDateTime.now())
                .build();
    }
}
