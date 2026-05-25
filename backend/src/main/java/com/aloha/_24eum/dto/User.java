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
public class User {
    private Long id;
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String role;          // USER / OWNER / ADMIN
    private String provider;      // LOCAL / KAKAO
    private String providerId;
    private String profileImage;
    private Boolean isBanned;
    private LocalDateTime bannedAt;
    private String bannedReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
