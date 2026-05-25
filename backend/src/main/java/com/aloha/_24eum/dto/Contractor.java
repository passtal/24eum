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
public class Contractor {
    private Long id;
    private Long userId;
    private String companyName;
    private String businessNumber;
    private Integer career;             // 경력 년수
    private String certifications;      // comma separated
    private String preferredTypes;      // comma separated (A,B,C,D)
    private String serviceArea;         // comma separated 지역
    private String introduction;
    private String portfolioImages;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private Boolean isBanned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 조인 조회용 (서비스 레이어에서 채워짐)
    private String nickname;            // 업자의 닉네임
    private String profileImage;
    private Boolean liked;              // 현재 사용자가 찜했는지
}
