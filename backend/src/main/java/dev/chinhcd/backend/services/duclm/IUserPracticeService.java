package dev.chinhcd.backend.services.duclm;

public interface IUserPracticeService {
    public Integer getPracticeInfoByUserId(Long id);
    public void saveUserPractice(Long userId, Integer practiceLevel);
}
