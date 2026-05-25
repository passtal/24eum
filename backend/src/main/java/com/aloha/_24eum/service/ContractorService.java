package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.Contractor;

public interface ContractorService {
    List<Contractor> list(String keyword, int page, int size);
    long countAll(String keyword);
    Contractor get(Long id, Long currentUserId);
    Contractor getByUserId(Long userId);
    Contractor create(Contractor contractor);
    Contractor update(Contractor contractor);
    void delete(Long id);
}
