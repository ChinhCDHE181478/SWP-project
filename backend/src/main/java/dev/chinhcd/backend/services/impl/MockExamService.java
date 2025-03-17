package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.models.duclm.UserMockExam;
import dev.chinhcd.backend.repository.duclm.IUserMockExamRepository;
import dev.chinhcd.backend.services.IMockExamService;
import dev.chinhcd.backend.services.duclm.IAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MockExamService implements IMockExamService {
    private final IUserMockExamRepository userMockExamRepository;
    private final IAnswerService answerService;

    @Override
    public void answerQuestion(Integer questionId, Long uexamId, String answer) {
        boolean isCorrect = answerService.isAnswerCorrect(answer, questionId);
        if(!isCorrect) {
            return;
        }

        UserMockExam ue = userMockExamRepository.findByUserMockExamId(uexamId).orElse(null);
        ue.setScore(ue.getScore() + 10);
        userMockExamRepository.save(ue);
    }
}
