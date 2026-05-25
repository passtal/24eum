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
public class UserBan {
    private Long id;
    private Long userId;
    private Long bannedBy;
    private String reason;
    private LocalDateTime bannedAt;
    private LocalDateTime unbannedAt;
}
