package dev.chinhcd.backend.dtos.response.longnt;

import dev.chinhcd.backend.models.longnt.News;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class PaginatedNewsResponse {
    private List<News> data;
    private int totalPages;
    private long totalItems;
    private int currentPage;
}
