package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.SmallPractice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ISmallPracticeRepository extends JpaRepository<SmallPractice, Long> {
    List<SmallPractice> findByPractice_PracticeId(Integer practiceId);
}
