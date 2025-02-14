package dev.chinhcd.backend.services.impl.longnt;

import dev.chinhcd.backend.dtos.response.longnt.PaginatedNewsResponse;
import dev.chinhcd.backend.models.longnt.News;
import dev.chinhcd.backend.repository.longnt.INewsRepository;
import dev.chinhcd.backend.services.longnt.INewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService implements INewsService {

    private final INewsRepository inewsRepository;

    @Override
    public List<News> getAllNews() {
        return inewsRepository.getAllNews();
    }

    // Thêm phương thức phân trang mới
    @Override
    public PaginatedNewsResponse getPaginatedNews(int page, int pageSize) {
        // Tạo đối tượng Pageable
        Pageable pageable = PageRequest.of(page - 1, pageSize); // Page bắt đầu từ 0
        Page<News> newsPage = inewsRepository.findAllNews(pageable); // Lấy dữ liệu phân trang từ repository

        // Trả về đối tượng PaginatedNewsResponse chứa dữ liệu phân trang
        return new PaginatedNewsResponse(
                newsPage.getContent(), // Dữ liệu bài viết
                newsPage.getTotalPages(), // Tổng số trang
                newsPage.getTotalElements(), // Tổng số mục
                newsPage.getNumber() + 1 // Trang hiện tại (lấy từ `getNumber()` và cộng 1 để bắt đầu từ 1)
        );
    }
}
