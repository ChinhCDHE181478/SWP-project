package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import dev.chinhcd.backend.models.duclm.TestResult;
import dev.chinhcd.backend.models.duclm.UserPractice;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.repository.duclm.IPracticeRepository;
import dev.chinhcd.backend.repository.duclm.ISmallPracticeRepository;
import dev.chinhcd.backend.repository.duclm.ITestResultRepository;
import dev.chinhcd.backend.repository.duclm.IUserPracticeRepository;
import dev.chinhcd.backend.services.duclm.IUserPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPracticeService implements IUserPracticeService {

    private final IUserRepository userRepository;
    private final ISmallPracticeRepository smallPracticeRepository;
    private final IUserPracticeRepository userPracticeRepository;
    private final ITestResultRepository testResultRepository;
    private final IPracticeRepository practiceRepository;

    @Override
    public Integer getPracticeInfoByUserId(Long id) {

        // Tìm UserPractice theo userId
        Optional<UserPractice> userPractice = userPracticeRepository.findByUserId(id);

        // Nếu tìm thấy, trả về practiceId
        if (userPractice.isPresent()) {
            return userPractice.get().getPractice().getPracticeId();  // Chỉ trả về practiceId
        }

        return null;
    }

    @Override
    public void saveUserPractice(Long userId, Integer practiceLevel) {
        int totalScore = 0;
        LocalTime totalTime = LocalTime.of(0, 0, 0); // Start with zero time



        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice_PracticeLevelAndPractice_Grade(practiceLevel, user.getGrade());
        List<TestResult> results = new ArrayList<>();

        for (SmallPractice smallPractice : smallPractices) {
            TestResult testResult = testResultRepository.findTestResultBySmallPractice_SmallPracticeId(smallPractice.getSmallPracticeId());
            results.add(testResult);
        }

        for (TestResult testResult : results) {
            totalScore += testResult.getScore();

            // Convert totalTime to LocalTime and sum it
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            LocalTime time = testResult.getTimeSpent().toLocalTime();
            totalTime = totalTime.plusHours(time.getHour()).plusMinutes(time.getMinute()).plusSeconds(time.getSecond());

        }

        String totalTimeString = String.format("%02d:%02d:%02d", totalTime.getHour(), totalTime.getMinute(), totalTime.getSecond());
        UserPractice testResult = new UserPractice();
        testResult.setTotalScore(totalScore);
        testResult.setTotalTime(Time.valueOf(totalTimeString));
        testResult.setUser(user);
        testResult.setPractice(practiceRepository.findByPracticeLevelAndGrade(practiceLevel, user.getGrade()).get());
        userPracticeRepository.save(testResult);
        // Convert totalTime back to String if needed
        if(practiceLevel < practiceRepository.findMaxLevel().get()){
            UserPractice userPractice = new UserPractice();
            userPractice.setUser(user);
            Practice practice = practiceRepository.findByPracticeLevelAndGrade(practiceLevel+1, user.getGrade()).get();
            userPractice.setPractice(practice);
            userPractice.setTotalTime(Time.valueOf(LocalTime.of(0, 0, 0)));
            userPractice.setTotalScore(0);
            userPracticeRepository.save(userPractice);
        }


    }

    public Integer getMaxPracticeLevelByUserId(Long userId) {
        return userPracticeRepository.findMaxPracticeLevelByUserId(userId)
                .orElse(null); // Nếu không có thì trả về null
    }

}
