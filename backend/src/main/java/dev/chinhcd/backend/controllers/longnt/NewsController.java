package dev.chinhcd.backend.controllers.longnt;

import dev.chinhcd.backend.dtos.response.longnt.PaginatedNewsResponse;
import dev.chinhcd.backend.models.longnt.News;
import dev.chinhcd.backend.services.impl.longnt.NewsService;
import dev.chinhcd.backend.services.longnt.INewsService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private final INewsService newsService;

    @GetMapping("/all")
    public ResponseEntity<List<News>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/pages")
    public PaginatedNewsResponse getPaginatedNews(
            @RequestParam(name = "page", defaultValue = "1") int page, // Tham số page với giá trị mặc định là 1
            @RequestParam(name = "pageSize", defaultValue = "6") int pageSize) { // Tham số pageSize với giá trị mặc định là 6
        return newsService.getPaginatedNews(page, pageSize); // Trả về dữ liệu phân trang
    }
}
