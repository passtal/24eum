package com.aloha._24eum.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.ChatMessageMapper;
import com.aloha._24eum.dao.ChatRoomMapper;
import com.aloha._24eum.dto.ChatMessage;
import com.aloha._24eum.dto.ChatRoom;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomMapper roomMapper;
    private final ChatMessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public ChatRoom getOrCreateRoom(Long userId, Long contractorId, Long estimateRequestId) {
        ChatRoom existing = roomMapper.findExisting(userId, contractorId, estimateRequestId);
        if (existing != null) return existing;
        ChatRoom room = ChatRoom.builder()
                .userId(userId)
                .contractorId(contractorId)
                .estimateRequestId(estimateRequestId)
                .build();
        roomMapper.insert(room);
        return roomMapper.findById(room.getId());
    }

    @Override public ChatRoom get(Long roomId) { return roomMapper.findById(roomId); }
    @Override public List<ChatRoom> listByUser(Long userId) { return roomMapper.findByUser(userId); }
    @Override public List<ChatRoom> listByContractorUser(Long contractorUserId) {
        return roomMapper.findByContractorUser(contractorUserId);
    }

    @Override
    @Transactional
    public ChatMessage send(ChatMessage message) {
        if (message.getMessageType() == null) message.setMessageType("TEXT");
        messageMapper.insert(message);
        roomMapper.updateLastMessage(
                message.getChatRoomId(),
                message.getContent(),
                LocalDateTime.now());

        // STOMP broadcast: /topic/chat.{roomId}
        ChatMessage saved = ChatMessage.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoomId())
                .senderId(message.getSenderId())
                .messageType(message.getMessageType())
                .content(message.getContent())
                .fileUrl(message.getFileUrl())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        messagingTemplate.convertAndSend("/topic/chat." + message.getChatRoomId(), saved);
        return saved;
    }

    @Override
    public List<ChatMessage> history(Long roomId, int page, int size) {
        int offset = Math.max(page, 0) * Math.max(size, 1);
        return messageMapper.findByRoom(roomId, offset, Math.max(size, 1));
    }

    @Override
    @Transactional
    public int markRead(Long roomId, Long readerId) {
        return messageMapper.markRead(roomId, readerId);
    }
}
