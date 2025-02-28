package dev.chinhcd.backend.services.impl.longnt;

import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.longnt.Articles;
import dev.chinhcd.backend.repository.longnt.IArticlesRepository;
import dev.chinhcd.backend.services.longnt.IArticlesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticlesService implements IArticlesService {

    private final IArticlesRepository articlesRepository;

    @Override
    public Optional<Articles> getArticlesById(long id) {
        return articlesRepository.findById(id);
    }

    @Override
    public PaginateArticlesResponse getPaginatedArticles(String type, int page, int pageSize) {
        ArticlesType articlesType;
        try {
            articlesType = ArticlesType.valueOf(type.toUpperCase()); // Chuyển String thành Enum
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid article type: " + type);
        }
        // Tạo đối tượng Pageable với pageNumber và pageSize
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        Page<Articles> articlesPage = articlesRepository.findAllArticlesByType(articlesType, pageable);

        // Trả về dữ liệu phân trang
        return new PaginateArticlesResponse(
                articlesPage.getContent(),  // Dữ liệu bài viết
                articlesPage.getTotalPages(),  // Tổng số trang
                articlesPage.getTotalElements(),  // Tổng số bài viết
                articlesPage.getNumber() + 1, // Trang hiện tại
                pageSize
        );
    }

    @Override
    public List<Articles> getSuggestedArticlesByType(ArticlesType type, int limit) {
        Pageable topN = PageRequest.of(0, limit);
        return articlesRepository.findTopSuggestedArticlesByType(type, topN);
    }

}
