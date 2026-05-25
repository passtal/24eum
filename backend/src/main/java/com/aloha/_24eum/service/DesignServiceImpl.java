package com.aloha._24eum.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.DesignMapper;
import com.aloha._24eum.dto.DesignModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DesignServiceImpl implements DesignService {

    private final DesignMapper designMapper;

    @Override public List<DesignModel> list() { return designMapper.findAll(); }
    @Override public DesignModel get(Long id) { return designMapper.findById(id); }
    @Override public DesignModel getByCode(String code) { return designMapper.findByCode(code); }

    @Override
    @Transactional
    public DesignModel create(DesignModel design) {
        designMapper.insert(design);
        return designMapper.findById(design.getId());
    }

    @Override
    @Transactional
    public DesignModel update(DesignModel design) {
        designMapper.update(design);
        return designMapper.findById(design.getId());
    }

    @Override
    @Transactional
    public void delete(Long id) { designMapper.delete(id); }
}
