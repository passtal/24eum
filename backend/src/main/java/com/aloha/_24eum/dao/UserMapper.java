package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.User;

@Mapper
public interface UserMapper {
    User findById(@Param("id") Long id);
    User findByEmail(@Param("email") String email);
    User findByProvider(@Param("provider") String provider, @Param("providerId") String providerId);

    boolean existsByEmail(@Param("email") String email);
    boolean existsByNickname(@Param("nickname") String nickname);

    int insert(User user);
    int update(User user);
    int updatePassword(@Param("id") Long id, @Param("password") String password);
    int delete(@Param("id") Long id);

    int updateBan(@Param("id") Long id,
                  @Param("isBanned") boolean isBanned,
                  @Param("reason") String reason);

    List<User> findAll(@Param("keyword") String keyword,
                       @Param("role") String role,
                       @Param("offset") int offset,
                       @Param("limit") int limit);
    long countAll(@Param("keyword") String keyword, @Param("role") String role);
}
