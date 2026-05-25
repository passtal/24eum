package com.aloha._24eum.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchingResult {
    private Long id;
    private Long estimateRequestId;
    private Long contractorId;
    private BigDecimal matchScore;
    private Integer matchRank;         // DB 컬럼명 (1~5)
    private String status;             // RECOMMENDED/SELECTED/REJECTED
    private LocalDateTime createdAt;

    // 조인 조회용
    private Contractor contractor;
}
