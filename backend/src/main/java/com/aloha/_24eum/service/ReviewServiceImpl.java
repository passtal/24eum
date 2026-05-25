package com.aloha._24eum.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.ContractorMapper;
import com.aloha._24eum.dao.ReviewMapper;
import com.aloha._24eum.dto.Review;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final ContractorMapper contractorMapper;

    @Override
    @Transactional
    public Review create(Review review) {
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5)
            throw new IllegalArgumentException("별점은 1~5 사이여야 합니다.");
        reviewMapper.insert(review);
        contractorMapper.recomputeRating(review.getContractorId());
        return reviewMapper.findById(review.getId());
    }

    @Override
    @Transactional
    public Review update(Review review, Long userId) {
        Review existing = reviewMapper.findById(review.getId());
        if (existing == null) throw new IllegalArgumentException("리뷰를 찾을 수 없습니다.");
        if (!existing.getUserId().equals(userId))
            throw new IllegalStateException("본인의 리뷰만 수정할 수 있습니다.");
        reviewMapper.update(review);
        contractorMapper.recomputeRating(existing.getContractorId());
        return reviewMapper.findById(review.getId());
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Review existing = reviewMapper.findById(id);
        if (existing == null) return;
        if (!existing.getUserId().equals(userId))
            throw new IllegalStateException("본인의 리뷰만 삭제할 수 있습니다.");
        reviewMapper.delete(id);
        contractorMapper.recomputeRating(existing.getContractorId());
    }

    @Override
    @Transactional
    public void setHidden(Long id, boolean hidden) {
        Review existing = reviewMapper.findById(id);
        if (existing == null) return;
        reviewMapper.updateHidden(id, hidden);
        contractorMapper.recomputeRating(existing.getContractorId());
    }

    @Override public Review get(Long id) { return reviewMapper.findById(id); }
    @Override public List<Review> listByContractor(Long contractorId) { return reviewMapper.findByContractor(contractorId); }
    @Override public List<Review> listByUser(Long userId) { return reviewMapper.findByUser(userId); }
    @Override
    public List<Review> listAll(String keyword, int page, int size) {
        int offset = Math.max(page, 0) * Math.max(size, 1);
        return reviewMapper.findAll(keyword, offset, Math.max(size, 1));
    }
    @Override public long countAll(String keyword) { return reviewMapper.countAll(keyword); }
}
