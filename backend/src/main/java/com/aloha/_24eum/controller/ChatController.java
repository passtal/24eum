package com.aloha._24eum.controller;

import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.ChatMessage;
import com.aloha._24eum.dto.ChatRoom;
import com.aloha._24eum.security.CustomUserDetails;
import com.aloha._24eum.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/rooms")
    public ChatRoom createRoom(@RequestBody Map<String, Long> body,
                               @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        return chatService.getOrCreateRoom(
                principal.getId(),
                body.get("contractorId"),
                body.get("estimateRequestId"));
    }

    @GetMapping("/rooms")
    public List<ChatRoom> myRooms(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        return chatService.listByUser(principal.getId());
    }

    @GetMapping("/rooms/{id}/messages")
    public List<ChatMessage> messages(@PathVariable Long id,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "50") int size) {
        return chatService.history(id, page, size);
    }

    @PostMapping("/rooms/{id}/read")
    public Map<String, Integer> markRead(@PathVariable Long id,
                                         @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) throw new IllegalArgumentException("로그인이 필요합니다.");
        return Map.of("updated", chatService.markRead(id, principal.getId()));
    }

    /** STOMP: /app/chat.{roomId} 로 전송된 메시지 처리 */
    @MessageMapping("/chat.{roomId}")
    public void onMessage(@DestinationVariable Long roomId, ChatMessage message) {
        message.setChatRoomId(roomId);
        chatService.send(message);
    }
}
