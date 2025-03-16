package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.request.duclm.UserPracticeRequest;
import dev.chinhcd.backend.dtos.response.duclm.PracticeLevelReportResponse;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.UserPractice;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.repository.duclm.IPracticeRepository;
import dev.chinhcd.backend.repository.duclm.IUserPracticeRepository;
import dev.chinhcd.backend.services.duclm.IPracticeService;
import dev.chinhcd.backend.services.duclm.ITestResultService;
import dev.chinhcd.backend.services.duclm.impl.UserPracticeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class UserPracticeController {

    private final UserPracticeService userPracticeService;
    private final IUserPracticeRepository userPracticeRespository;
    private final IPracticeRepository practiceRepository;
    private final IUserRepository userRepository;
    private final ITestResultService testResultService;
    private final IPracticeService practiceService;

    @GetMapping("/get-practice-info/{id}")
    public ResponseEntity<Integer> getPracticeInfo(@PathVariable Long id) {
        Integer maxPracticeLevel = userPracticeService.getMaxPracticeLevelByUserId(id);

        if (maxPracticeLevel == null) {
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
            Practice practice = practiceRepository.findByPracticeLevelAndGrade(1, user.getGrade())
                    .orElseThrow(() -> new RuntimeException("Practice level 1 not found"));

            UserPractice userPractice = new UserPractice();
            userPractice.setUser(user);
            userPractice.setPractice(practice);
            userPractice.setTotalScore(0);
            userPractice.setTotalTime(Time.valueOf("00:00:00"));
            userPracticeRespository.save(userPractice);

            // Gọi lại chính API này để lấy level lớn nhất sau khi tạo
            return getPracticeInfo(id);
        }

        return ResponseEntity.ok(maxPracticeLevel);
    }


    @GetMapping("/stats")
    public ResponseEntity<List<PracticeLevelReportResponse>> getPracticeStats() {
        List<PracticeLevelReportResponse> stats = userPracticeRespository.getUserCountByLevel();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/user-practice/add")
    public ResponseEntity<?> addUserPractice(@RequestBody UserPracticeRequest request) {
        try {
            userPracticeService.saveUserPractice(request.userId(), request.level());
            return ResponseEntity.ok().body("Hoàn tất vòng thi thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi hoàn tất vòng thi!");
        }
    }

    @Transactional
    @DeleteMapping("/test-results/delete/{level}")
    public ResponseEntity<String> deleteTestResults(
            @PathVariable Integer level,
            @RequestBody(required = false) Map<String, Long> request) {

        if (request == null || !request.containsKey("userId")) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        Long userId = request.get("userId");

        try {
            boolean deleted = testResultService.deleteTestResultsByLevelAndUserId(level, userId);
            if (deleted) {
                return ResponseEntity.ok("Test results deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No test results found for given level and user");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting test results");
        }
    }

    @GetMapping("/completed/{userId}")
    public ResponseEntity<Boolean> checkCompletion(@PathVariable Long userId) {
        try {
            // Lấy thông tin vòng thi của người dùng
            boolean isCompleted = practiceService.isUserCompleted(userId);
            return ResponseEntity.ok(isCompleted);
        } catch (Exception e) {
            // Xử lý lỗi
            return ResponseEntity.status(500).body(false);
        }
    }


}
