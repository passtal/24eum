package com.aloha._24eum.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.EstimateMapper;
import com.aloha._24eum.dto.EstimateRequest;
import com.aloha._24eum.dto.MatchingResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstimateServiceImpl implements EstimateService {

    private final EstimateMapper estimateMapper;
    private final MatchingService matchingService;

    @Override
    @Transactional
    public EstimateRequest create(EstimateRequest req) {
        if (req.getBudget() == null || req.getBudget() <= 0)
            throw new IllegalArgumentException("예산은 0보다 커야 합니다.");
        if (req.getArea() == null || req.getArea().signum() <= 0)
            throw new IllegalArgumentException("면적(평수)은 0보다 커야 합니다.");
        if (req.getStatus() == null) req.setStatus("PENDING");
        estimateMapper.insert(req);

        // 견적 생성 직후 자동 매칭
        matchingService.matchTop5(req);
        estimateMapper.updateStatus(req.getId(), "MATCHED");
        req.setStatus("MATCHED");
        return estimateMapper.findById(req.getId());
    }

    @Override
    public EstimateRequest get(Long id) { return estimateMapper.findById(id); }

    @Override
    public List<EstimateRequest> listByUser(Long userId) { return estimateMapper.findByUser(userId); }

    @Override
    @Transactional
    public void updateStatus(Long id, String status) { estimateMapper.updateStatus(id, status); }

    @Override
    @Transactional
    public void cancel(Long id, Long userId) {
        EstimateRequest existing = estimateMapper.findById(id);
        if (existing == null) throw new IllegalArgumentException("견적 요청을 찾을 수 없습니다.");
        if (!existing.getUserId().equals(userId))
            throw new IllegalStateException("본인의 견적 요청만 취소할 수 있습니다.");
        estimateMapper.updateStatus(id, "CANCELLED");
    }

    @Override
    public List<MatchingResult> matches(Long estimateId) {
        return matchingService.findByEstimate(estimateId);
    }
}
