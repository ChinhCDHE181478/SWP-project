package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IQuestionRepository extends JpaRepository<Question, Integer> {
}
