package dev.chinhcd.backend.services.longnt;

import dev.chinhcd.backend.dtos.response.longnt.PaginatedNewsResponse;
import dev.chinhcd.backend.models.longnt.News;
import org.springframework.data.domain.Page;

import java.util.List;

public interface INewsService {

    List<News> getAllNews();

    PaginatedNewsResponse getPaginatedNews(int page, int pageSize); // Phương thức phân trang mới
}
