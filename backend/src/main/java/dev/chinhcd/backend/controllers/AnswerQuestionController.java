package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.services.IExamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AnswerQuestionController {
    private final SimpMessagingTemplate messagingTemplate;
    private final IExamService examService;

    @MessageMapping("/register")
    public void registerUser(@Payload String username, SimpMessageHeaderAccessor headerAccessor) {
    }

    @SendToUser("/queue/total-score")
    @MessageMapping("/answer")
    public String receiveAnswer(@Payload String answer, SimpMessageHeaderAccessor headerAccessor) {
        // Xử lý đáp án
        String result = answer.equalsIgnoreCase("A") ? "Đúng" : "Sai";

        return result;
    }

    @MessageMapping("/answer/exam")
    public void answerExam(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String[] parts = message.split("-", 3);
        Long userId = Long.parseLong(parts[0]);
        Integer questionId = Integer.parseInt(parts[1]);
        String answer = parts[2];
        // Xử lý đáp án
        examService.answerQuestion(userId, questionId, answer);
    }

    @MessageMapping("/answer/mock-exam")
    public void answerMockExam(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String[] parts = message.split("-", 3);
        Long userId = Long.parseLong(parts[0]);
        Integer questionId = Integer.parseInt(parts[1]);
        String answer = parts[2];
        // Xử lý đáp án
        examService.answerQuestion(userId, questionId, answer);
    }

}
