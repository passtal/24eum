package com.aloha._24eum.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    private Long id;
    private Long userId;
    private Long contractorId;
    private Long estimateRequestId;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;

    // 조인 조회용
    private String userNickname;
    private String contractorName;
    private Integer unreadCount;
}
