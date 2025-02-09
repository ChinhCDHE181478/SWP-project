"use client";
import React from "react";
import NotificationItem from "./NotificationItem";

const notifications = [
  { image: "/images/news1.jpg", title: "Tin tức 1", description: "Mô tả tin tức 1..." },
  { image: "/images/news2.jpg", title: "Tin tức 2", description: "Mô tả tin tức 2..." },
  { image: "/images/news3.jpg", title: "Tin tức 3", description: "Mô tả tin tức 3..." },
];

const NotificationList: React.FC = () => {
  return (
    <div className="space-y-4">
      {notifications.map((item, index) => (
        <NotificationItem key={index} {...item} />
      ))}
    </div>
  );
};

export default NotificationList;
