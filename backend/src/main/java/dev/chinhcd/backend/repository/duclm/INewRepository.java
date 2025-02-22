package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.New;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface INewRepository extends JpaRepository<New, Long> {

    @Query("SELECT n FROM New n ORDER BY n.id DESC LIMIT 3")
    List<New> findThreeNews();

}
