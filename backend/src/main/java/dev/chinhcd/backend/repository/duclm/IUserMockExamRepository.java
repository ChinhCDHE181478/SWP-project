package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserExam;
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

    @Query("select ue from UserMockExam ue " +
            "join MockExam e on e.mockExamId = ue.mockExam.mockExamId " +
            "join MockExamQuestion eq on eq.mockExam.mockExamId = e.mockExamId" +
            " where eq.question.questionId=:questionId and ue.user.id=:userId")
    Optional<UserMockExam> findByQuestionIdAndUserId(Integer questionId, Long userId);
}
