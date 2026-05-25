package com.aloha._24eum.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dao.ContractorMapper;
import com.aloha._24eum.dao.UserMapper;
import com.aloha._24eum.dto.Contractor;
import com.aloha._24eum.dto.Review;
import com.aloha._24eum.dto.User;
import com.aloha._24eum.service.ContractorService;
import com.aloha._24eum.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminApiController {

    private final UserMapper userMapper;
    private final ContractorMapper contractorMapper;
    private final ContractorService contractorService;
    private final ReviewService reviewService;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of(
                "totalUsers",       userMapper.countAll(null, null),
                "totalContractors", contractorService.countAll(null),
                "totalReviews",     reviewService.countAll(null)
        );
    }

    // ----- Users -----
    @GetMapping("/users")
    public Map<String, Object> listUsers(@RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) String role,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size) {
        int offset = page * size;
        List<User> items = userMapper.findAll(keyword, role, offset, size);
        items.forEach(u -> u.setPassword(null));
        return Map.of(
                "items",      items,
                "totalCount", userMapper.countAll(keyword, role),
                "page",       page,
                "size",       size
        );
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<Void> ban(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body == null ? null : body.get("reason");
        userMapper.updateBan(id, true, reason);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<Void> unban(@PathVariable Long id) {
        userMapper.updateBan(id, false, null);
        return ResponseEntity.noContent().build();
    }

    // ----- Contractors -----
    @GetMapping("/contractors")
    public Map<String, Object> listContractors(@RequestParam(required = false) String keyword,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        List<Contractor> items = contractorService.list(keyword, page, size);
        return Map.of(
                "items",      items,
                "totalCount", contractorService.countAll(keyword),
                "page",       page,
                "size",       size
        );
    }

    @PutMapping("/contractors/{id}/ban")
    public ResponseEntity<Void> banContractor(@PathVariable Long id) {
        contractorMapper.updateBan(id, true);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/contractors/{id}/unban")
    public ResponseEntity<Void> unbanContractor(@PathVariable Long id) {
        contractorMapper.updateBan(id, false);
        return ResponseEntity.noContent().build();
    }

    // ----- Reviews -----
    @GetMapping("/reviews")
    public Map<String, Object> listReviews(@RequestParam(required = false) String keyword,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        List<Review> items = reviewService.listAll(keyword, page, size);
        return Map.of(
                "items",      items,
                "totalCount", reviewService.countAll(keyword),
                "page",       page,
                "size",       size
        );
    }

    @PutMapping("/reviews/{id}/hide")
    public ResponseEntity<Void> hideReview(@PathVariable Long id) {
        reviewService.setHidden(id, true);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reviews/{id}/show")
    public ResponseEntity<Void> showReview(@PathVariable Long id) {
        reviewService.setHidden(id, false);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        // 관리자 권한 — userId 검증 우회를 위해 mapper 직접 호출 (서비스의 author check 회피)
        Review r = reviewService.get(id);
        if (r != null) reviewService.setHidden(id, true);  // soft delete 정책
        return ResponseEntity.noContent().build();
    }
}
