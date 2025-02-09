"use client";
import React from "react";

interface Props {
  image: string;
  title: string;
  description: string;
}

const NotificationItem: React.FC<Props> = ({ image, title, description }) => {
  return (
    <div className="flex gap-4 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <img src={image} alt={title} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md bg-gray-300" />
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default NotificationItem;