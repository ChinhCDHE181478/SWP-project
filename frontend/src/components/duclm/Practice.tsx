"use client";
import React, { useEffect, useState } from 'react';

interface PracticeProps {
    currentLevel: string;
    userId: string;
    userClass: string;
}

const Practice: React.FC<PracticeProps> = ({ currentLevel, userId, userClass }) => {

    const [maxLevel, setMaxLevel] = useState<number | null>(null);
      
    
      useEffect(() => {
        fetch("http://localhost:8080/api/v1/exams/max-level")
          .then((response) => response.json())
          .then((data) => {
            setMaxLevel(data);
          })
          .catch((error) => {
            console.error("Error fetching max level:", error);
          });
      }, []);


    return (
        <div>
            <div className="bg-slate-200 h-28 w-full flex items-center justify-center"> {/* Ensure it takes the full width */}
                <div className="w-full max-w-7xl px-6"> {/* Apply max-width here */}
                    <h3 className="text-xl font-semibold">Tự luyện vòng hệ thống: {maxLevel !== null ? maxLevel : "..."}</h3>
                </div>
            </div>


            <div className="px-6 py-8 max-w-7xl mx-auto"> {/* Applied max-w-2xl and mx-auto */}

                <div>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Khối bạn đang dự thi: {userClass}</h3>
                        <div className="text-sm text-gray-500">Số vòng thi IOE đang mở: {maxLevel}</div>
                        <div className="text-sm text-gray-500">Vòng thi hiện tại của bạn: {currentLevel}</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left column: Instructions and Notes */}
                    <div className="flex flex-col md:col-span-2">
                        <div className="bg-yellow-100 p-4 rounded-lg mb-8">
                            <h4 className="text-lg font-semibold mb-4">Lưu ý:</h4>
                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                <li>Mỗi vòng Tự luyện gồm 3 bài thi. Bạn cần đạt ít nhất 75% số điểm mỗi bài thi để hoàn thành.</li>
                                <li>Kết quả của một lần Tự luyện được tính bằng tổng điểm và tổng thời gian làm bài của 3 bài thi (1, 2, 3).</li>
                                <li>Sau khi hoàn thành các bài thi, bạn có thể chọn:
                                    <ul className="list-inside list-disc">
                                        <li>“Làm lại” để luyện tập lại các bài tập trong vòng Tự luyện.</li>
                                        <li>“Ghi lại kết quả” để hoàn thành vòng Tự luyện và chuyển sang vòng tiếp theo.</li>
                                    </ul>
                                </li>
                                <li>Không giới hạn số lần làm lại các vòng Tự luyện trước khi ấn “Ghi lại kết quả”. Hệ thống chỉ lưu lại kết quả cao nhất trong các lần làm vòng Tự luyện và kết quả này sẽ được sử dụng để xét thứ hạng của tài khoản trong Bảng xếp hạng tuần.</li>
                            </ul>
                        </div>

                        <div className="bg-red-100 p-4 rounded-lg mb-8">
                            <h4 className="text-lg font-semibold mb-4">Các trường hợp thi sai luật:</h4>
                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                <li>Đăng nhập một tài khoản trên hai máy hoặc hai trình duyệt khác nhau và thi cùng một thời điểm.</li>
                                <li>Đang làm bài thi mà tải lại trang đề thi hoặc thoát ra mà không nộp bài.</li>
                                <li>Mở nhiều cửa sổ vào thi một lúc.</li>
                            </ul>
                            <p className="text-sm text-gray-700 mt-2">Các trường hợp vi phạm sẽ khiến hệ thống tự động thoát ra ngoài và tính một lần trượt vòng thi.</p>
                        </div>

                        {/* Section: User's Score Table */}
                        <div className="overflow-x-auto shadow-lg rounded-lg bg-white mt-8">
                            <table className="min-w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-center">STT</th>
                                        <th className="px-6 py-3 text-center">Bài Thi</th>
                                        <th className="px-6 py-3 text-center">Lần Thi</th>
                                        <th className="px-6 py-3 text-center">Điểm Đã Thi</th>
                                        <th className="px-6 py-3 text-center">Thời Gian (Giây)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    <tr className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4">1</td>
                                        <td className="px-6 py-4">Bài thi 1 Hoàn Thành</td>
                                        <td className="px-6 py-4">1</td>
                                        <td className="px-6 py-4">80</td>
                                        <td className="px-6 py-4">233</td>
                                    </tr>
                                    <tr className="bg-gray-50 hover:bg-gray-100">
                                        <td className="px-6 py-4">2</td>
                                        <td className="px-6 py-4">Bài thi 2 Hoàn Thành</td>
                                        <td className="px-6 py-4">1</td>
                                        <td className="px-6 py-4">100</td>
                                        <td className="px-6 py-4">36</td>
                                    </tr>
                                    <tr className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4">3</td>
                                        <td className="px-6 py-4">Bài thi 3 Hoàn Thành</td>
                                        <td className="px-6 py-4">1</td>
                                        <td className="px-6 py-4">60</td>
                                        <td className="px-6 py-4">17</td>
                                    </tr>
                                    {/* Row for Final Score */}
                                    <tr className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4"></td>
                                        <td className="px-6 py-4 text-red-600 font-bold">Kết quả tự luyện</td>
                                        <td className="px-6 py-4"></td>
                                        <td className="px-6 py-4">0</td>
                                        <td className="px-6 py-4">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right column: User information */}
                    <div className="flex flex-col md:col-span-1 ">
                        {/* Avatar and User Information in a row (2 columns) */}
                        <div className="flex items-center mb-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                Avatar
                            </div>
                            {/* User Information */}
                            <div className="ml-3"> {/* Reduce the left margin from 4 to 3 */}
                                <h4 className="text-lg font-semibold mb-2">User name</h4>
                                <div className="text-sm text-gray-700 mb-2">ID: <span className="font-medium">{userId}</span></div>
                                <div className="text-sm text-gray-700 mb-4">Khối: <span className="font-medium">{userClass}</span></div>
                            </div>
                        </div>

                        {/* Additional Information (Xã, Huyện, Thành phố, etc.) */}
                        <div className="bg-gray-200 p-4 rounded-lg">
                            <div className="text-sm text-gray-700">
                                <div className="mb-2">Xã: <span className="font-medium">Thông tin xã</span></div>
                                <div className="mb-2">Huyện: <span className="font-medium">Thông tin huyện</span></div>
                                <div className="mb-2">Thành phố: <span className="font-medium">Thông tin thành phố</span></div>
                                <div>Vòng thi tiếp theo: <span className="font-medium">{currentLevel} + 1</span></div>
                            </div>
                        </div>
                    </div>




                </div>


            </div>
        </div>
    );
};

export default Practice;
