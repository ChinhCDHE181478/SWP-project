package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.SmallPractice;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import java.util.List;

=======
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
>>>>>>> main
public interface ISmallPracticeRepository extends JpaRepository<SmallPractice, Long> {
    List<SmallPractice> findByPractice_PracticeId(Integer practiceId);
}
