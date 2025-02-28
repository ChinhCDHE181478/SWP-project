package dev.chinhcd.backend.services.duclm.impl;


import dev.chinhcd.backend.models.duclm.Articles;
import dev.chinhcd.backend.repository.duclm.IArticlesRepository;
import dev.chinhcd.backend.services.duclm.IArticlesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticlesService implements IArticlesService {

    private final IArticlesRepository iArticlesRepository;

    @Override
    public List<Articles> getThreeNews() {
        return iArticlesRepository.findThreeNews();
    }

    @Override
    public List<Articles> getThreeTips() {
        return iArticlesRepository.findThreeTips();
    }
}
