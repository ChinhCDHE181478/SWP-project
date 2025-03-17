package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.UserPractice;

import java.util.List;

public interface IUserPracticeService {
    Integer getPracticeInfoByUserId(Long id);
    void saveUserPractice(Long userId, Integer practiceLevel);
    List<UserPractice> getResult(Long userId);
}
