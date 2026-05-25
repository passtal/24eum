package com.aloha._24eum.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.Contractor;
import com.aloha._24eum.dto.Review;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.ContractorService;
import com.aloha._24eum.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contractors")
@RequiredArgsConstructor
public class ContractorController {

    private final ContractorService contractorService;
    private final ReviewService reviewService;

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String keyword,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "12") int size) {
        return Map.of(
                "items",      contractorService.list(keyword, page, size),
                "totalCount", contractorService.countAll(keyword),
                "page",       page,
                "size",       size
        );
    }

    @GetMapping("/{id}")
    public Contractor get(@PathVariable Long id,
                          @AuthenticationPrincipal CustomUserDetails principal) {
        Long currentUserId = principal == null ? null : principal.getId();
        return contractorService.get(id, currentUserId);
    }

    @PostMapping
    public Contractor create(@RequestBody Contractor contractor,
                             @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        contractor.setUserId(principal.getId());
        return contractorService.create(contractor);
    }

    @PutMapping("/{id}")
    public Contractor update(@PathVariable Long id,
                             @RequestBody Contractor contractor,
                             @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        contractor.setId(id);
        return contractorService.update(contractor);
    }

    @GetMapping("/{id}/reviews")
    public List<Review> reviews(@PathVariable Long id) {
        return reviewService.listByContractor(id);
    }
}
