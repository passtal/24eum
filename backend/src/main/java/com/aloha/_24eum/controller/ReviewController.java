package com.aloha._24eum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.Review;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public Review create(@RequestBody Review review,
                         @AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        review.setUserId(principal.getId());
        return reviewService.create(review);
    }

    @PutMapping("/{id}")
    public Review update(@PathVariable Long id, @RequestBody Review review,
                         @AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        review.setId(id);
        return reviewService.update(review, principal.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal CustomUserDetails principal) {
        require(principal);
        reviewService.delete(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public Review get(@PathVariable Long id) { return reviewService.get(id); }

    private void require(CustomUserDetails p) {
        if (p == null) throw new IllegalArgumentException("로그인이 필요합니다.");
    }
}
