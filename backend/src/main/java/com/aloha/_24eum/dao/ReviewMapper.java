package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.Review;

@Mapper
public interface ReviewMapper {
    int insert(Review review);
    int update(Review review);
    int delete(@Param("id") Long id);
    int updateHidden(@Param("id") Long id, @Param("isHidden") boolean isHidden);

    Review findById(@Param("id") Long id);
    List<Review> findByContractor(@Param("contractorId") Long contractorId);
    List<Review> findByUser(@Param("userId") Long userId);
    List<Review> findAll(@Param("keyword") String keyword,
                         @Param("offset") int offset,
                         @Param("limit") int limit);
    long countAll(@Param("keyword") String keyword);
}
