package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Practice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
<<<<<<< HEAD

import java.util.Optional;


=======
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
>>>>>>> main
public interface IPracticeRepository extends JpaRepository<Practice, Long>  {

    @Query("SELECT MAX(e.practiceLevel) FROM Practice e")
    Optional<Integer> findMaxLevel();

    Optional<Practice> findByPracticeLevelAndGrade(int practiceLevel, int grade);
}
