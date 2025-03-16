package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.models.duclm.Answer;
import dev.chinhcd.backend.models.duclm.UserExam;
import dev.chinhcd.backend.models.duclm.UserMockExam;
import dev.chinhcd.backend.repository.duclm.IAnswerRepository;
import dev.chinhcd.backend.repository.duclm.IUserMockExamRepository;
import dev.chinhcd.backend.services.IMockExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MockExamService implements IMockExamService {
    private final IAnswerRepository answerRepository;
    private final IUserMockExamRepository userMockExamRepository;

    @Override
    public void answerQuestion(Long userId, Integer questionId, String answer) {
        Answer a = answerRepository.findByQuestionId(questionId);
        if(!a.getCorrectAnswer().trim().equals(answer.trim())) {
            return;
        }

        UserMockExam ue = userMockExamRepository.findByQuestionIdAndUserId(questionId, userId).orElse(null);
        ue.setScore(ue.getScore() + 10);
        userMockExamRepository.save(ue);
    }
}
