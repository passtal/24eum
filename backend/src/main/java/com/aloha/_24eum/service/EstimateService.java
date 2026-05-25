package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.EstimateRequest;
import com.aloha._24eum.dto.MatchingResult;

public interface EstimateService {
    EstimateRequest create(EstimateRequest req);
    EstimateRequest get(Long id);
    List<EstimateRequest> listByUser(Long userId);
    void updateStatus(Long id, String status);
    void cancel(Long id, Long userId);

    /** 매칭 결과 조회 (Top 5) */
    List<MatchingResult> matches(Long estimateId);
}
