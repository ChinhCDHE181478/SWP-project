import React from "react";

const NewsHeader: React.FC = () => {
  return (
    <div className="bg-gray-100 border-t-4 border-blue-500 p-4">
      <h1 className="text-lg font-semibold text-gray-900">Tin tức Ban Tổ Chức</h1>
      <nav className="text-sm text-gray-600">
        <a href="/" className="hover:text-blue-500">Trang chủ</a> / 
        <a href="/news" className="hover:text-blue-500"> Tin tức</a> / 
        <span className="text-gray-800"> Tin tức Ban Tổ Chức</span>
      </nav>
    </div>
  );
};

export default NewsHeader;