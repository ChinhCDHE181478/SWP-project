package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.UserPractice;

import java.util.List;

public interface IUserPracticeService {
    public Integer getPracticeInfoByUserId(Long id);
    public void saveUserPractice(Long userId, Integer practiceLevel);
    public List<UserPractice> getResult(Long userId);
}
