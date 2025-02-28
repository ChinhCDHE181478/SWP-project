"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-[#f9a825] text-white py-10 mt-10">
            <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-4 gap-8">
                
                {/* Cột 1: Logo và thương hiệu */}
                <div className="col-span-1 flex flex-col items-start">
                    <Image src="/logo-edu.png" alt="EDU Logo" width={120} height={120} />
                    <p className="mt-2 text-lg font-semibold">EDU - Học tập trực tuyến</p>
                </div>

                {/* Cột 2: Danh mục tin tức */}
                <div>
                    <h3 className="text-xl font-bold">Tin tức</h3>
                    <ul className="mt-2 space-y-2">
                        <li><Link href="#" className="hover:underline">Tin tức & Sự kiện</Link></li>
                        <li><Link href="#" className="hover:underline">Tin từ Ban tổ chức</Link></li>
                        <li><Link href="#" className="hover:underline">Tin tức muôn nơi</Link></li>
                    </ul>
                </div>

                {/* Cột 3: Hỗ trợ học viên */}
                <div>
                    <h3 className="text-xl font-bold">Hỗ trợ</h3>
                    <ul className="mt-2 space-y-2">
                        <li><Link href="#" className="hover:underline">Trung tâm hỗ trợ</Link></li>
                        <li><Link href="#" className="hover:underline">Hướng dẫn sử dụng</Link></li>
                        <li><Link href="#" className="hover:underline">Câu hỏi thường gặp</Link></li>
                    </ul>
                </div>

                {/* Cột 4: Thông tin liên hệ */}
                <div>
                    <h3 className="text-xl font-bold">Liên hệ</h3>
                    <p className="mt-2">📞 Hotline: <strong>1900.123.456</strong></p>
                    <p className="mt-1">📧 Email: support@edu.vn</p>
                    <p className="mt-1">📍 Địa chỉ: Hà Nội, Việt Nam</p>
                </div>
            </div>

            {/* Dòng bản quyền */}
            <div className="text-center mt-6 border-t border-white/20 pt-4 text-sm">
                © 2025 EDU. Tất cả quyền được bảo lưu.
            </div>
        </footer>
    );
};

export default Footer;