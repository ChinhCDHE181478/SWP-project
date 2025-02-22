package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ITestResultRepository extends JpaRepository<TestResult, Long> {

    Optional<TestResult> findByUserIdAndSmallPractice_SmallPracticeId(Long userId, Integer smallPracticeId);
}
