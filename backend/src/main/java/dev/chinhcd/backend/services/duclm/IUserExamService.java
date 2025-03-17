package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.UserExam;

import java.util.List;
import java.util.Optional;

public interface IUserExamService {
    public Optional<UserExam> getUserExamResult(Long userId, String examName);

    public List<UserExam> getUserExamList(String examName, int limit);

    List<UserExam> searchResults(String province, Integer grade,String examName);
}
