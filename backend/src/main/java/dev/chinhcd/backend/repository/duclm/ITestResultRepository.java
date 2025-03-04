package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import java.util.Optional;

=======
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
>>>>>>> main
public interface ITestResultRepository extends JpaRepository<TestResult, Long> {

    Optional<TestResult> findByUserIdAndSmallPractice_SmallPracticeId(Long userId, Integer smallPracticeId);
}
