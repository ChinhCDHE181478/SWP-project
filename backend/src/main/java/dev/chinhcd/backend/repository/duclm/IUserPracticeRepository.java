package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserPractice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserPracticeRepository extends JpaRepository<UserPractice, Integer> {
    Optional<UserPractice> findByUserId(Long userId);
}
