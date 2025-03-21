package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.dtos.response.UserExamResponse;
import dev.chinhcd.backend.dtos.response.UserPracticeResponse;
import dev.chinhcd.backend.models.duclm.UserPractice;

import java.sql.Time;
import java.util.List;

public interface IUserPracticeService {
    Integer getPracticeInfoByUserId(Long id);
    void saveUserPractice(Long userId, Integer practiceLevel);
    List<UserPractice> getResult(Long userId);
    List<UserPractice> getLevelResult(Long userId, Integer practiceLevel);

    boolean checkUserResult(Long userId, Integer level);

}
