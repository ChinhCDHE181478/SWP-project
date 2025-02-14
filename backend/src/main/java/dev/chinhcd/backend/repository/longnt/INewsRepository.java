package dev.chinhcd.backend.repository.longnt;

import dev.chinhcd.backend.models.longnt.News;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface INewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n ORDER BY n.id DESC")
    List<News> getAllNews();

    // Sử dụng JPQL để viết truy vấn phân trang
    @Query("SELECT n FROM News n ORDER BY n.date DESC")
    Page<News> findAllNews(Pageable pageable); // Trả về dữ liệu phân trang
}
