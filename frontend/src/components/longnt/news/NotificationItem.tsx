"use client";
import React from "react";

interface Props {
  date: string
  title: string;
  description: string;
  imageUrl: string;
}

const NotificationItem: React.FC<Props> = ({ title, date, description, imageUrl }) => {

  // Chuyển đổi string date thành đối tượng Date và định dạng lại
  const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="flex gap-4 p-4 rounded-lg mx-auto">
        <img
          src={imageUrl}
          alt={title}
          className="w-24 h-24 md:w-32 md:h-32 bg-gray-300"
        />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-gray-400">{formattedDate}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;