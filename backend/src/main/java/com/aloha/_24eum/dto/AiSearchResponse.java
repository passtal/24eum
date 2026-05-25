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
public class AiSearchResponse {
    private String query;
    private String response;
    private String model;
    private LocalDateTime createdAt;
}
