package com.aloha._24eum.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.Auth;
import com.aloha._24eum.dto.User;
import com.aloha._24eum.security.JwtProvider;
import com.aloha._24eum.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User created = userService.signup(user);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<Auth> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        User user = userService.getByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
        if (Boolean.TRUE.equals(user.getIsBanned())) {
            throw new IllegalStateException("차단된 계정입니다.");
        }
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(user.getEmail(), null);
        token.setDetails(user.getId());

        Auth auth = Auth.builder()
                .accessToken(jwtProvider.createAccessToken(user))
                .refreshToken(jwtProvider.createRefreshToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtProvider.getAccessExpirationSeconds())
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole())
                .build();
        return ResponseEntity.ok(auth);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // 클라이언트에서 토큰 폐기 (Stateless)
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Auth> refresh(@RequestBody Map<String, String> body) {
        String refresh = body.get("refreshToken");
        if (refresh == null || !jwtProvider.validate(refresh)) {
            throw new IllegalArgumentException("유효하지 않은 refresh token 입니다.");
        }
        Long userId = jwtProvider.getUserId(refresh);
        User user = userService.getById(userId);
        if (user == null) throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");

        Auth auth = Auth.builder()
                .accessToken(jwtProvider.createAccessToken(user))
                .refreshToken(jwtProvider.createRefreshToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtProvider.getAccessExpirationSeconds())
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole())
                .build();
        return ResponseEntity.ok(auth);
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        return Map.of("available", userService.isEmailAvailable(email));
    }

    @GetMapping("/check-nickname")
    public Map<String, Boolean> checkNickname(@RequestParam String nickname) {
        return Map.of("available", userService.isNicknameAvailable(nickname));
    }
}
