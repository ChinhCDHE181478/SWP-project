package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserPractice;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import java.util.Optional;

=======
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
>>>>>>> main
public interface IUserPracticeRepository extends JpaRepository<UserPractice, Integer> {
    Optional<UserPractice> findByUserId(Long userId);
}
