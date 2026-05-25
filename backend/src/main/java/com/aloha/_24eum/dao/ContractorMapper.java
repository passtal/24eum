package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.Contractor;

@Mapper
public interface ContractorMapper {
    List<Contractor> findAll(@Param("keyword") String keyword,
                             @Param("offset") int offset,
                             @Param("limit") int limit);
    long countAll(@Param("keyword") String keyword);

    Contractor findById(@Param("id") Long id);
    Contractor findByUserId(@Param("userId") Long userId);

    int insert(Contractor contractor);
    int update(Contractor contractor);
    int delete(@Param("id") Long id);
    int updateBan(@Param("id") Long id, @Param("isBanned") boolean isBanned);

    int recomputeRating(@Param("id") Long id);
}
