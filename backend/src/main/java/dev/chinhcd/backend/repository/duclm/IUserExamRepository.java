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

        @Query("SELECT ue FROM UserExam ue " +
                "JOIN ue.user u " +
                "JOIN ue.exam e " +
                "WHERE (:examName IS NULL OR e.examName LIKE %:examName%) " +
                "AND (:grade IS NULL OR u.grade = %:grade%) " +
                "AND (:province IS NULL OR u.province LIKE %:province%) " +
                "ORDER BY ue.score DESC")
        List<UserExam> searchResults(@Param("examName") String examName,
                                     @Param("grade") Integer grade,
                                     @Param("province") String province);


//    List<UserExam> findUserExamByExam_ExamNameAndAndExam_GradeAndUser_ProvinceOrderByScoreDesc(String examName, String examGrade, String userProvince);

    @Query("select ue from UserExam ue where ue.user.id=:userId and ue.exam.examId=:examId")
    UserExam findUserExamByUserIdAndExamId(Long userId, Long examId);

}
