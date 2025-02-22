package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Practice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface IPracticeRepository extends JpaRepository<Practice, Long>  {

    @Query("SELECT MAX(e.practiceId) FROM Practice e")
    Optional<Integer> findMaxLevel();
}
