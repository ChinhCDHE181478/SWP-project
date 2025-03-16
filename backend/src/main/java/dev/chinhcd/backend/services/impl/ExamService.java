package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.models.duclm.Answer;
import dev.chinhcd.backend.models.duclm.UserExam;
import dev.chinhcd.backend.repository.duclm.IAnswerRepository;
import dev.chinhcd.backend.repository.duclm.IExamRepository;
import dev.chinhcd.backend.repository.duclm.IUserExamRepository;
import dev.chinhcd.backend.services.IExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamService implements IExamService {
    private final IAnswerRepository answerRepository;
    private final IUserExamRepository userExamRepository;

    @Override
    public void answerQuestion(Long userId, Integer questionId, String answer) {
        Answer a = answerRepository.findByQuestionId(questionId);
        if(!a.getCorrectAnswer().trim().equals(answer.trim())) {
            return;
        }
        UserExam ue = userExamRepository.findByQuestionIdAndUserId(questionId, userId).orElse(null);
        ue.setScore(ue.getScore() + 10);
        userExamRepository.save(ue);
    }
}
