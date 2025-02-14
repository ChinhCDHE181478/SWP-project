"use client"
import React, { useEffect, useState } from "react";

interface NewsItem {
    id: number;
    title: string;
    imageUrl: string;
}

const SuggestionNews: React.FC = () => {
    // State để lưu dữ liệu tin gợi ý, trạng thái loading và lỗi
    const [suggestedNews, setSuggestedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/news/all")
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi lấy tin gợi ý!");
                return res.json();
            })
            .then((data: NewsItem[]) => {
                setSuggestedNews(data.slice(0, 3));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching suggested news:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Nếu đang tải hoặc có lỗi, hiển thị thông báo
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-blue-500">Có thể bạn quan tâm</h2> {/* Màu xanh cho tiêu đề */}
            </div>

            <div className="flex gap-4">
                {suggestedNews.map((news) => (
                    <div key={news.id} className="flex flex-col gap-2 p-4 rounded-lg w-1/3">
                        <img
                            src={news.imageUrl || "/news/anhNews.jpg"} // Sử dụng ảnh từ API hoặc ảnh mặc định
                            alt={news.title}
                            className="w-48 h-32 object-cover rounded-md bg-gray-300 opacity-80"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-center">{news.title}</h3> {/* Đưa chữ xuống dưới ảnh */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestionNews;