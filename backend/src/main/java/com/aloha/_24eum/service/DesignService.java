package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.DesignModel;

public interface DesignService {
    List<DesignModel> list();
    DesignModel get(Long id);
    DesignModel getByCode(String code);
    DesignModel create(DesignModel design);
    DesignModel update(DesignModel design);
    void delete(Long id);
}
