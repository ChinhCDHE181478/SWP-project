package dev.chinhcd.backend.services;

public interface IMockExamService {

    void answerQuestion(Long userId, Integer questionId, String answer);
}
