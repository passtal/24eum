package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.ChatRoom;

@Mapper
public interface ChatRoomMapper {
    int insert(ChatRoom room);
    ChatRoom findById(@Param("id") Long id);
    ChatRoom findExisting(@Param("userId") Long userId,
                          @Param("contractorId") Long contractorId,
                          @Param("estimateRequestId") Long estimateRequestId);

    List<ChatRoom> findByUser(@Param("userId") Long userId);
    List<ChatRoom> findByContractorUser(@Param("contractorUserId") Long contractorUserId);

    int updateLastMessage(@Param("id") Long id,
                          @Param("lastMessage") String lastMessage,
                          @Param("lastMessageAt") java.time.LocalDateTime lastMessageAt);
}
