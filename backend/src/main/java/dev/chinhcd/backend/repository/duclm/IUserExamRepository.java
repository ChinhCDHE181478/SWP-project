package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserExamRepository extends JpaRepository<UserExam, Integer> {
    Optional<UserExam> findTopByUserIdAndExamNameOrderByUserExamIdDesc(Long userId, String examName);

    @Query("SELECT ue FROM UserExam ue WHERE ue.examName = :examName ORDER BY ue.score DESC, ue.totalTime ASC LIMIT :limit")
    List<UserExam> findTopUsersByExamName(@Param("examName") String examName, @Param("limit") int limit);

    Optional<UserExam> findByUserExamId(Long userExamId);

    @Query("select ue.score from UserExam ue where ue.user.id=:userId and ue.exam.examId=:examId")
    Double getScoreByUserIdAndExamId(Long userId, Long examId);

    @Query("select ue from UserExam ue where ue.user.id=:userId and ue.exam.examId=:examId")
    UserExam findUserExamByUserIdAndExamId(Long userId, Long examId);

}
