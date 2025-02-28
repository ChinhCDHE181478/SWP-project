package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.Articles;
import dev.chinhcd.backend.services.duclm.impl.ArticlesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticlesController {

    private final ArticlesService articlesService;

    @GetMapping("/news/latest")
    public ResponseEntity<List<Articles>> getLatestNews() {
        return ResponseEntity.ok(articlesService.getThreeNews());
    }

    @GetMapping("/tips/latest")
    public ResponseEntity<List<Articles>> getLatestTips() {
        return ResponseEntity.ok(articlesService.getThreeTips());
    }
}
