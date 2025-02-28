package dev.chinhcd.backend.repository.longnt;

import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.longnt.Articles;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IArticlesRepository extends JpaRepository<Articles, Long> {

    // Tìm tất cả bài viết theo `ArticlesType`
    @Query("SELECT n FROM Articles n WHERE n.articlesType = :type ORDER BY n.date DESC")
    Page<Articles> findAllArticlesByType(@Param("type") ArticlesType type, Pageable pageable);

    Optional<Articles> findById(Long id);

    @Query("SELECT a FROM Articles a WHERE a.articlesType = :type ORDER BY a.date DESC")
    List<Articles> findTopSuggestedArticlesByType(@Param("type") ArticlesType type, Pageable pageable);

}
