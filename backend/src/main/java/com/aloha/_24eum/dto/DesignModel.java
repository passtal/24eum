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
public class DesignModel {
    private Long id;
    private String modelCode;          // A / B / C / D
    private String name;
    private String description;
    private String thumbnailImage;
    private String detailImages;       // JSON 배열 문자열
    private Long basePrice;
    private String category;
    private String styleKeywords;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
