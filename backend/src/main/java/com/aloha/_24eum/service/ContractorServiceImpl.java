package com.aloha._24eum.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.ContractorMapper;
import com.aloha._24eum.dao.LikeMapper;
import com.aloha._24eum.dto.Contractor;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractorServiceImpl implements ContractorService {

    private final ContractorMapper contractorMapper;
    private final LikeMapper likeMapper;

    @Override
    public List<Contractor> list(String keyword, int page, int size) {
        int offset = Math.max(page, 0) * Math.max(size, 1);
        return contractorMapper.findAll(keyword, offset, Math.max(size, 1));
    }

    @Override
    public long countAll(String keyword) { return contractorMapper.countAll(keyword); }

    @Override
    public Contractor get(Long id, Long currentUserId) {
        Contractor c = contractorMapper.findById(id);
        if (c == null) return null;
        if (currentUserId != null) {
            c.setLiked(likeMapper.exists(currentUserId, id));
        }
        return c;
    }

    @Override
    public Contractor getByUserId(Long userId) { return contractorMapper.findByUserId(userId); }

    @Override
    @Transactional
    public Contractor create(Contractor contractor) {
        contractorMapper.insert(contractor);
        return contractorMapper.findById(contractor.getId());
    }

    @Override
    @Transactional
    public Contractor update(Contractor contractor) {
        contractorMapper.update(contractor);
        return contractorMapper.findById(contractor.getId());
    }

    @Override
    @Transactional
    public void delete(Long id) { contractorMapper.delete(id); }
}
