package com.aloha._24eum.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    private Long id;
    private Long userId;
    private Long contractorId;
    private Long estimateRequestId;
    private Integer rating;            // 1~5
    private String content;
    private String images;             // JSON 배열 문자열
    private Boolean isHidden;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 조인 조회용
    private String userNickname;
    private String contractorName;
}
