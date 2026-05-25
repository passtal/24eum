package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.Review;

public interface ReviewService {
    Review create(Review review);
    Review update(Review review, Long userId);
    void delete(Long id, Long userId);
    void setHidden(Long id, boolean hidden);

    Review get(Long id);
    List<Review> listByContractor(Long contractorId);
    List<Review> listByUser(Long userId);
    List<Review> listAll(String keyword, int page, int size);
    long countAll(String keyword);
}
