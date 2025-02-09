"use client";
import React from "react";

interface Props {
  image: string;
  title: string;
  description: string;
}

const NotificationHeader: React.FC<Props> = ({ image, title, description }) => {
  return (
    <div className="relative w-full h-60 md:h-80 bg-gray-200">
      <img src={image} alt={title} className="w-full h-full object-cover opacity-80" />
      <div className="absolute top-1/3 left-5 md:left-10 bg-black bg-opacity-50 text-white p-4">
        <h1 className="text-xl md:text-3xl font-bold">{title}</h1>
        <p className="text-sm md:text-base mt-2">{description}</p>
      </div>
    </div>
  );
};

export default NotificationHeader;