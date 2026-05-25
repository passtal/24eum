package com.aloha._24eum.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.Contractor;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{contractorId}")
    public ResponseEntity<Void> add(@PathVariable Long contractorId,
                                    @AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        likeService.add(principal.getId(), contractorId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{contractorId}")
    public ResponseEntity<Void> remove(@PathVariable Long contractorId,
                                       @AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        likeService.remove(principal.getId(), contractorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Contractor> myLikes(@AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        return likeService.listLiked(principal.getId());
    }

    private void require(CustomUserDetails p) {
        if (p == null) throw new IllegalArgumentException("로그인이 필요합니다.");
    }
}
