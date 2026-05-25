package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.AiSearchLog;

@Mapper
public interface AiSearchLogMapper {
    int insert(AiSearchLog log);
    List<AiSearchLog> findByUser(@Param("userId") Long userId);
    List<AiSearchLog> findRecent(@Param("limit") int limit);
}
