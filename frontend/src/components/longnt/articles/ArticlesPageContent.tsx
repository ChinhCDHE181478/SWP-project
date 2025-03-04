"use client";
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import ArticlesList from "./ArticlesList";
import Image from "next/image";
import { Articles } from "@/types/type";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const ArticlesPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") || "news";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const pageSize = 6; // Số bài viết mỗi trang

  const [articles, setArticles] = useState<Articles[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Gọi API để lấy dữ liệu bài viết
  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/v1/articles?type=${type}&page=${page}&pageSize=${pageSize}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu bài viết!");
        return res.json();
      })
      .then((data) => {
        setArticles(data.articles || []);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [type, page]);

  // Xử lý sự kiện chuyển trang
  const onPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  if (loading || error) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-[1050px]">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
        </div>
      </div>
    );
  }

  const [highlightArticle, ...otherArticles] = articles;

  return (
    <div>
      {highlightArticle && (
        <Link
          key={highlightArticle.id}
          href={`/articles/${highlightArticle.id}`}
          className="block"
        >
          <div className="relative mx-auto h-auto mt-10 w-[1050px]">
            <div className="relative w-full h-60 md:h-80">
              <Image
                src={highlightArticle.imageUrl || ""}
                alt={highlightArticle.title || ""}
                layout="fill"
                objectFit="cover"
                priority
                className="opacity-80 rounded-lg"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[20%] bg-black bg-opacity-30 text-white p-3">
              <h1 className="text-xl md:text-4xl font-bold">
                {highlightArticle.title}
              </h1>
            </div>
          </div>
        </Link>
      )}
      <ArticlesList articles={otherArticles} /> {/* Gọi danh sách bài viết */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ArticlesPageContent;
