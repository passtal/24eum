package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.Contractor;

public interface LikeService {
    void add(Long userId, Long contractorId);
    void remove(Long userId, Long contractorId);
    boolean isLiked(Long userId, Long contractorId);
    List<Contractor> listLiked(Long userId);
}
