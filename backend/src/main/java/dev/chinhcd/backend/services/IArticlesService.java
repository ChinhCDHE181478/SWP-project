package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;

import java.util.List;
import java.util.Optional;

public interface IArticlesService {

    Optional<Articles> getArticlesById(long id);

    PaginateArticlesResponse getPaginatedArticles(String type, int page, int pageSize);

    List<Articles> getSuggestedArticlesByType(ArticlesType type, int limit);

    List<Articles> getThreeNews();

    List<Articles> getThreeTips();

}
