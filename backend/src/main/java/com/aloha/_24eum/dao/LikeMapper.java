package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.Contractor;

@Mapper
public interface LikeMapper {
    int insert(@Param("userId") Long userId, @Param("contractorId") Long contractorId);
    int delete(@Param("userId") Long userId, @Param("contractorId") Long contractorId);
    boolean exists(@Param("userId") Long userId, @Param("contractorId") Long contractorId);
    List<Contractor> findLikedContractors(@Param("userId") Long userId);
}
