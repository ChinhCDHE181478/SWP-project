"use client";

import React from "react";

// Định nghĩa kiểu cho các link trong menu
type MenuItem = {
  label: string;
  link: string;
  icon: string;
};

const topMenuItems: MenuItem[] = [
  { label: "Tự Luyện", link: "/self-study", icon: "" },
  { label: "Thi Thử", link: "/mock-test", icon: "" },
  { label: "Đăng nhập", link: "/login", icon: "" },
  { label: "Đăng ký", link: "/signup", icon: "" },
];

const bottomMenuItems: MenuItem[] = [
  { label: "Hướng Dẫn Thi", link: "/guide", icon: "" },
  { label: "Kết quả Thi", link: "/results", icon: "" },
  { label: "Về Trang Web", link: "/about", icon: "" },
  { label: "Tin Tức & Sự Kiện", link: "/news", icon: "" },
];

const Header = () => {
  return (
    <header className="bg-yellow-500">
      {/* Logo lớn và Menu trên cùng */}
      <div className="flex justify-between items-center p-4">
        {/* Logo lớn ở bên trái */}
        <div className="flex items-center">
          <img src="/path/to/logo.svg" alt="Logo" className="w-16 h-16" />
        </div>

        {/* Menu trên cùng bên phải */}
        <nav className="flex space-x-6">
          {topMenuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="text-white text-lg hover:text-blue-500"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Dòng phân cách dưới menu */}
      <div className="border-b-2 border-orange-500"></div>

      {/* Logo nhỏ và Menu dưới cùng */}
      <div className="flex flex-col items-center py-6">

        <nav className="flex space-x-6">
          {bottomMenuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="text-white text-lg hover:text-blue-500"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
