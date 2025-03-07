package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;
import dev.chinhcd.backend.services.IArticlesService;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticlesController {

    private final IArticlesService articlesService;

    @GetMapping("/{id}")
    public ResponseEntity<Articles> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articlesService.getArticlesById(id).orElse(null));
    }

    @GetMapping
    public ResponseEntity<PaginateArticlesResponse> getPaginatedArticles(
            @RequestParam(name = "type", defaultValue = "news") String type,
            @RequestParam(name = "page", defaultValue = "1") int page, // Tham số page với giá trị mặc định là 1
            @RequestParam(name = "pageSize", defaultValue = "6") int pageSize) { // Tham số pageSize với giá trị mặc định là 6
        return ResponseEntity.ok(articlesService.getPaginatedArticles(type, page, pageSize)); // Trả về dữ liệu phân trang
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<Articles>> getSuggestedArticles(@RequestParam("type") ArticlesType type) {
        List<Articles> articles = articlesService.getSuggestedArticlesByType(type, 3);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/news/latest")
    public ResponseEntity<List<Articles>> getLatestNews() {
        return ResponseEntity.ok(articlesService.getThreeNews());
    }

    @GetMapping("/tips/latest")
    public ResponseEntity<List<Articles>> getLatestTips() {
        return ResponseEntity.ok(articlesService.getThreeTips());
    }
}
