package com.aloha._24eum.service;

import com.aloha._24eum.dto.AiSearchResponse;

public interface AiSearchService {
    AiSearchResponse search(Long userId, String query);
}
