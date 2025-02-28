package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Articles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IArticlesRepository extends JpaRepository<Articles, Long> {

    @Query("SELECT n FROM Articles n where n.articlesType = 'NEWS' ORDER BY n.id DESC LIMIT 3")
    List<Articles> findThreeNews();

    @Query("SELECT n FROM Articles n where n.articlesType = 'TIPS' ORDER BY n.id DESC LIMIT 3")
    List<Articles> findThreeTips();

}
