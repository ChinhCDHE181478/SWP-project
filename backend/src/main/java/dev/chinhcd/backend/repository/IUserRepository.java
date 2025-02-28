package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> getUsersByRole(Role role);

}
