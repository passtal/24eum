package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.DesignModel;

@Mapper
public interface DesignMapper {
    List<DesignModel> findAll();
    DesignModel findById(@Param("id") Long id);
    DesignModel findByCode(@Param("code") String code);
    int insert(DesignModel design);
    int update(DesignModel design);
    int delete(@Param("id") Long id);
}
