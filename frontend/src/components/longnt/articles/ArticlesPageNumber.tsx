"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ArticleDetailItem from "@/components/longnt/articles/ArticleDetailItem";
import { Articles } from "@/types/type";
import ArticlesHeader from "./ArticlesHeader";

const ArticlesPageNumber = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const [data, setData] = useState<Articles | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Hàm fetch để lấy dữ liệu bài viết chi tiết từ backend API
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/v1/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy bài viết!");
        return res.json();
      })
      .then((data: Articles) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Nếu đang tải hoặc có lỗi, hiển thị thông báo
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Hiển thị dữ liệu bài viết chi tiết
  return (
    <div>
      <ArticlesHeader type={data?.articlesType.toLowerCase() || "news"} />
      {data ? <ArticleDetailItem data={data} /> : <div>No data found</div>}
    </div>
  );
};

export default ArticlesPageNumber;
