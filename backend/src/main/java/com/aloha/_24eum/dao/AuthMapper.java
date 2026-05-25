package com.aloha._24eum.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.PersistentLogin;

@Mapper
public interface AuthMapper {
    PersistentLogin findBySeries(@Param("series") String series);
    int insertToken(PersistentLogin token);
    int updateToken(@Param("series") String series,
                    @Param("token") String token,
                    @Param("lastUsed") java.time.LocalDateTime lastUsed);
    int deleteByUsername(@Param("username") String username);
}
