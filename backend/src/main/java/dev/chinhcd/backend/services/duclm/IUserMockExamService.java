package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.dtos.response.UserExamResponse;
import dev.chinhcd.backend.models.duclm.UserMockExam;

import java.sql.Time;
import java.util.List;


public interface IUserMockExamService {
    UserMockExam getMostRecentMockExam(Long userId);

    List<UserMockExam> getAggregatedResults(Long userId);

    Double getScores(Long mockExamId, Long time);

    Long addUserMockExam(Long userId, Long mockExamId);

}

