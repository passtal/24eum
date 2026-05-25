package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.EstimateRequest;
import com.aloha._24eum.dto.MatchingResult;

public interface MatchingService {
    /** 견적 요청을 기반으로 Top 5 업자 매칭 → DB 저장 후 반환 */
    List<MatchingResult> matchTop5(EstimateRequest req);
    List<MatchingResult> findByEstimate(Long estimateRequestId);
}
