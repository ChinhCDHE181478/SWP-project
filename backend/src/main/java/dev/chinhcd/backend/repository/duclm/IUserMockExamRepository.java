package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserMockExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserMockExamRepository extends JpaRepository<UserMockExam, Long> {
    UserMockExam findTopByUser_IdOrderByUserMockExamIdDesc(Long userId);

    List<UserMockExam> findByUser_Id(Long userId);

    @Query("select ue from UserMockExam ue " +
            "JOIN MockExam m on m.mockExamId = ue.mockExam.mockExamId " +
            "where FUNCTION('MONTH', m.examDate)=:month and ue.user.id=:userId")
    List<UserMockExam> findByMonthAndUserId(Integer month, Long userId);

    Optional<UserMockExam> findByUserMockExamId(Long userMockExamId);

    @Query("select ume.score from UserMockExam ume where ume.user.id=:userId and ume.mockExam.mockExamId=:mockExamId")
    List<Double> getScoreByUserIdAndMockExamId(Long userId, Long mockExamId);

    @Query("select ume from UserMockExam ume where ume.user.id=:userId and ume.mockExam.mockExamId=:mockExamId")
    List<UserMockExam> findUserMockExamByUserIdAndExamId(Long userId, Long examId);

}
