package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.Articles;

import java.util.List;

public interface IArticlesService {
    List<Articles> getThreeNews();

    List<Articles> getThreeTips();
}
