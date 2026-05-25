package com.aloha._24eum.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.LikeMapper;
import com.aloha._24eum.dto.Contractor;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeMapper likeMapper;

    @Override
    @Transactional
    public void add(Long userId, Long contractorId) { likeMapper.insert(userId, contractorId); }

    @Override
    @Transactional
    public void remove(Long userId, Long contractorId) { likeMapper.delete(userId, contractorId); }

    @Override
    public boolean isLiked(Long userId, Long contractorId) {
        return likeMapper.exists(userId, contractorId);
    }

    @Override
    public List<Contractor> listLiked(Long userId) { return likeMapper.findLikedContractors(userId); }
}
