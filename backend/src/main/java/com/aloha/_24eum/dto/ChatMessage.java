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
public class ChatMessage {
    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String messageType;        // TEXT/IMAGE/FILE
    private String content;
    private String fileUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
