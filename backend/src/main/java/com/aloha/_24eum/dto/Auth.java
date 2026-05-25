package com.aloha._24eum.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Auth {
    private String accessToken;
    private String refreshToken;
    private String tokenType;     // "Bearer"
    private Long expiresIn;       // 초 단위 만료시간
    private Long userId;
    private String email;
    private String nickname;
    private String role;
}
