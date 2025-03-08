package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Answer;
import dev.chinhcd.backend.models.duclm.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAnswerRepository extends JpaRepository<Answer, Integer> {
    Optional<Answer> findByQuestion(Question question);
}
