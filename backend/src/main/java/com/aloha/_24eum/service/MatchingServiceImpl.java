package com.aloha._24eum.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.DesignMapper;
import com.aloha._24eum.dao.MatchingMapper;
import com.aloha._24eum.dto.Contractor;
import com.aloha._24eum.dto.DesignModel;
import com.aloha._24eum.dto.EstimateRequest;
import com.aloha._24eum.dto.MatchingResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    private final MatchingMapper matchingMapper;
    private final DesignMapper designMapper;

    @Override
    @Transactional
    public List<MatchingResult> matchTop5(EstimateRequest req) {
        String designCode = null;
        if (req.getDesignModelId() != null) {
            DesignModel dm = designMapper.findById(req.getDesignModelId());
            if (dm != null) designCode = dm.getModelCode();
        }

        List<Contractor> candidates = matchingMapper.findCandidates(designCode, req.getArea());
        List<Scored> scored = new ArrayList<>();
        for (Contractor c : candidates) {
            scored.add(new Scored(c, score(c, designCode)));
        }
        scored.sort(Comparator.comparing((Scored s) -> s.score).reversed());

        matchingMapper.deleteByEstimate(req.getId());

        List<MatchingResult> saved = new ArrayList<>();
        int rank = 1;
        for (Scored s : scored) {
            if (rank > 5) break;
            MatchingResult mr = MatchingResult.builder()
                    .estimateRequestId(req.getId())
                    .contractorId(s.contractor.getId())
                    .matchScore(s.score)
                    .matchRank(rank++)
                    .status("RECOMMENDED")
                    .build();
            matchingMapper.insert(mr);
            mr.setContractor(s.contractor);
            saved.add(mr);
        }
        return saved;
    }

    @Override
    public List<MatchingResult> findByEstimate(Long estimateRequestId) {
        return matchingMapper.findByEstimate(estimateRequestId);
    }

    /**
     * 매칭 점수 계산 (0 ~ 100)
     *  - 선호 시공형태 매칭 35점 (preferred_types 에 designCode 포함)
     *  - 경력 가산 (년 * 2, 최대 30)
     *  - 평균 별점 가산 (rating * 5, 최대 25)
     *  - 리뷰수 가산 (min(reviewCount, 10), 최대 10)
     */
    private BigDecimal score(Contractor c, String designCode) {
        double s = 0;
        String prefer = c.getPreferredTypes() == null ? "" : c.getPreferredTypes().replace(" ", "");
        if (designCode != null && !designCode.isBlank()) {
            for (String p : prefer.split(",")) {
                if (p.equalsIgnoreCase(designCode)) { s += 35; break; }
            }
        }
        if (c.getCareer() != null) s += Math.min(c.getCareer() * 2.0, 30);
        if (c.getAverageRating() != null) s += Math.min(c.getAverageRating().doubleValue() * 5.0, 25);
        if (c.getReviewCount() != null) s += Math.min(c.getReviewCount(), 10);
        return BigDecimal.valueOf(s).setScale(2, RoundingMode.HALF_UP);
    }

    private record Scored(Contractor contractor, BigDecimal score) {}
}
