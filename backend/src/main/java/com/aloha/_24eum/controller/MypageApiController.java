package com.aloha._24eum.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.ChatRoom;
import com.aloha._24eum.dto.Contractor;
import com.aloha._24eum.dto.EstimateRequest;
import com.aloha._24eum.dto.Review;
import com.aloha._24eum.dto.User;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.ChatService;
import com.aloha._24eum.service.EstimateService;
import com.aloha._24eum.service.LikeService;
import com.aloha._24eum.service.ReviewService;
import com.aloha._24eum.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MypageApiController {

    private final UserService userService;
    private final EstimateService estimateService;
    private final ReviewService reviewService;
    private final LikeService likeService;
    private final ChatService chatService;

    @GetMapping
    public Map<String, Object> me(@AuthenticationPrincipal CustomUserDetails p) {
        require(p);
        User u = userService.getById(p.getId());
        u.setPassword(null);
        return Map.of(
                "user",      u,
                "estimates", estimateService.listByUser(p.getId()).size(),
                "reviews",   reviewService.listByUser(p.getId()).size(),
                "likes",     likeService.listLiked(p.getId()).size()
        );
    }

    @PutMapping("/profile")
    public User updateProfile(@AuthenticationPrincipal CustomUserDetails p,
                              @RequestBody User update) {
        require(p);
        update.setId(p.getId());
        User saved = userService.updateProfile(update);
        saved.setPassword(null);
        return saved;
    }

    @GetMapping("/estimates")
    public List<EstimateRequest> estimates(@AuthenticationPrincipal CustomUserDetails p) {
        require(p);
        return estimateService.listByUser(p.getId());
    }

    @GetMapping("/reviews")
    public List<Review> reviews(@AuthenticationPrincipal CustomUserDetails p) {
        require(p);
        return reviewService.listByUser(p.getId());
    }

    @GetMapping("/likes")
    public List<Contractor> likes(@AuthenticationPrincipal CustomUserDetails p) {
        require(p);
        return likeService.listLiked(p.getId());
    }

    @GetMapping("/chats")
    public List<ChatRoom> chats(@AuthenticationPrincipal CustomUserDetails p) {
        require(p);
        return chatService.listByUser(p.getId());
    }

    private void require(CustomUserDetails p) {
        if (p == null) throw new IllegalArgumentException("로그인이 필요합니다.");
    }
}
