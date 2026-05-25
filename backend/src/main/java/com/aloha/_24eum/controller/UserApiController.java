package com.aloha._24eum.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.User;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;

    @GetMapping("/me")
    public User me(@AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        User user = userService.getById(principal.getId());
        user.setPassword(null);
        return user;
    }

    @PutMapping("/me")
    public User updateMe(@AuthenticationPrincipal CustomUserDetails principal,
                         @RequestBody User update) {
        require(principal);
        update.setId(principal.getId());
        User saved = userService.updateProfile(update);
        saved.setPassword(null);
        return saved;
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, String> body) {
        require(principal);
        userService.changePassword(principal.getId(),
                body.get("oldPassword"), body.get("newPassword"));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(@AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        userService.delete(principal.getId());
        return ResponseEntity.noContent().build();
    }

    private void require(CustomUserDetails p) {
        if (p == null) throw new IllegalArgumentException("로그인이 필요합니다.");
    }
}
