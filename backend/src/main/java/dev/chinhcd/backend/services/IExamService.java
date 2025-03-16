package dev.chinhcd.backend.services;

public interface IExamService {


    void answerQuestion(Long userId, Integer questionId, String answer);
}
