package dev.chinhcd.backend.services;

public interface IMockExamService {

    void answerQuestion(Integer questionId, Long uexamId, String answer);
}
