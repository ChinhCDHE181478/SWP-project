"use client";
import React, { useEffect, useState } from "react";

interface Notification {
  title: string;
  imageUrl: string;
}

const NotificationHeader: React.FC = () => {
  // State để lưu dữ liệu thông báo, trạng thái loading và lỗi
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/news/all")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu thông báo!");
        return res.json();
      })
      .then((data: Notification) => {
        setNotification(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notification:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Nếu đang tải hoặc có lỗi, hiển thị thông báo
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative mx-auto h-auto bg-gray-200 mt-10 w-[1270px] px-4">
      <div className="relative w-full h-60 md:h-80">
        <img
          src={notification?.imageUrl || "/news/anhnewsto.jpg"} // Sử dụng ảnh từ API hoặc ảnh mặc định
          alt={notification?.title || "Thông báo"}
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-20 text-white p-4">
        <h1 className="text-xl md:text-4xl font-bold">{notification?.title || "BTC thông báo kỳ thi các cấp"}</h1>
      </div>
    </div>
  );
};

export default NotificationHeader;