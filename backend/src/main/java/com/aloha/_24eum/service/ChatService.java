package com.aloha._24eum.service;

import java.util.List;

import com.aloha._24eum.dto.ChatMessage;
import com.aloha._24eum.dto.ChatRoom;

public interface ChatService {
    ChatRoom getOrCreateRoom(Long userId, Long contractorId, Long estimateRequestId);
    ChatRoom get(Long roomId);
    List<ChatRoom> listByUser(Long userId);
    List<ChatRoom> listByContractorUser(Long contractorUserId);

    ChatMessage send(ChatMessage message);
    List<ChatMessage> history(Long roomId, int page, int size);
    int markRead(Long roomId, Long readerId);
}
