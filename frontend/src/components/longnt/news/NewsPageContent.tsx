import React, { useState, useEffect } from "react";
import Pagination from "./Pagination"; // Import Pagination component
import NotificationList from "./NotificationList"; // Import NotificationList component
import NotificationHeader from "./NotificationHeader"; // Import NotificationHeader component

interface NewsItem {
    id: number;
    date: string
    title: string;
    content: string;
    imageUrl: string;
}


const NewsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [events, setEvents] = useState<NewsItem[]>([]); // Dữ liệu bài viết
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
    const [error, setError] = useState<string>(""); // Trạng thái lỗi

    const pageSize = 6; // Số mục mỗi trang

    // Hàm gọi API để fetch dữ liệu phân trang
    const fetchNews = async (page: number) => {
        setLoading(true); // Bắt đầu loading
        fetch(`http://localhost:8080/api/v1/news/pages?page=${page}&pageSize=${pageSize}`)
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi lấy tin tức!");
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setEvents(data.data || []); // Cập nhật dữ liệu bài viết
                setTotalPages(data.totalPages); // Cập nhật tổng số trang
                setLoading(false); // Kết thúc loading
            })
            .catch((err) => {
                console.error("Error fetching news:", err);
                setError(err.message);
                setLoading(false);
            });
    };

    // Khi trang thay đổi, gọi lại API
    const onPageChange = (page: number) => {
        setCurrentPage(page);
        fetchNews(page); // Fetch dữ liệu cho trang mới
    };

    // Đảm bảo rằng khi component mount, ta sẽ fetch dữ liệu từ trang 1
    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage]);

    // Nếu đang tải hoặc có lỗi, hiển thị thông báo
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>

            {/* Hiển thị danh sách bài viết */}
            <NotificationList events={events} />

            {/* Hiển thị phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default NewsPage;