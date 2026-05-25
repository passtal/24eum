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
public class EstimateRequest {
    private Long id;
    private Long userId;
    private Long designModelId;
    private Long budget;
    private BigDecimal area;           // 평수
    private String address;
    private String description;
    private String status;             // PENDING/MATCHED/IN_PROGRESS/COMPLETED/CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 조인 조회용
    private String designModelCode;
    private String designModelName;
}
