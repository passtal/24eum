package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.ChatMessage;

@Mapper
public interface ChatMessageMapper {
    int insert(ChatMessage message);
    List<ChatMessage> findByRoom(@Param("chatRoomId") Long chatRoomId,
                                 @Param("offset") int offset,
                                 @Param("limit") int limit);
    int markRead(@Param("chatRoomId") Long chatRoomId,
                 @Param("readerId") Long readerId);
    int countUnread(@Param("chatRoomId") Long chatRoomId,
                    @Param("readerId") Long readerId);
}
