package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.EstimateRequest;

@Mapper
public interface EstimateMapper {
    int insert(EstimateRequest req);
    EstimateRequest findById(@Param("id") Long id);
    List<EstimateRequest> findByUser(@Param("userId") Long userId);
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    int delete(@Param("id") Long id);
}
