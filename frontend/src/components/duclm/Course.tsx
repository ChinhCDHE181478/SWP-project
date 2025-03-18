"use client";

import { useAuth } from "@/app/AuthProvider";
import { API } from "@/helper/axios";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import React from "react";

const Course: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const user = useCurrentUser();
  const { toast } = useToast();

  const courseData = [
    {
      title: "FREE COURSE",
      price: "Miễn Phí",
      details: ["Tham gia 5 vòng thi đầu tiên", "Truy cập một phần kỳ thi"],
      amount: 0,
      type: "FREE_COURSE",
      link: "#",
    },
    {
      title: "FULL COURSE",
      price: "99.000 đ/năm",
      details: [
        "Truy cập vào toàn bộ kỳ thi",
        "Thi thử 3 lần",
        "Ôn luyện và đánh giá hiệu quả toàn diện",
      ],
      amount: 99000,
      type: "FULL_COURSE",
    },
    {
      title: "COMBO COURSE",
      price: "199.000 đ/năm",
      details: [
        "Truy cập toàn bộ kỳ thi không giới hạn",
        "Thi thử không giới hạn số lần",
        "Tối ưu hóa lộ trình học tập và thi",
      ],
      amount: 199000,
      type: "COMBO_COURSE",
    },
  ];

  // Xử lý khi bấm vào "MUA GÓI NGAY"
  const handlePurchaseClick = async (amount: number, type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Vui lòng đăng nhập để tiếp tục!",
        className: "text-white bg-orange-500",
      });
      router.push("/auth/login");
    } else {
      try {
        const response = await API.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
          {
            id: user.data?.id,
            amount: amount,
            accountType: type,
            language: "vi",
          }
        );

        if (response.data) {
          window.location.href = response.data;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        //handle exception
      }
    }
  };
  

  return (
    <div className="w-full py-8 bg-[#F5BA3A]">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-center font-bold text-2xl mb-8 text-white">
          CÁC KHÓA HỌC EDUTEST
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course, index) => (
            <div
              key={index}
              className="bg-black bg-opacity-60 p-6 rounded-lg shadow-md w-full h-full flex flex-col justify-between backdrop-blur-lg"
            >
              {/* Title Row */}
              <div className="flex justify-center mb-2">
                <h2 className="text-xl font-bold text-center text-white">
                  {course.title}
                </h2>
              </div>

              {/* Price Row */}
              <div className="flex justify-center mb-4">
                <p className="text-lg text-center text-white">{course.price}</p>
              </div>

              {/* Details Row */}
              <div className="flex-1">
                <ul className="text-sm text-gray-300">
                  {course.details.map((detail, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button Row */}
              <div className="flex justify-center">
                <button
                  onClick={() =>
                    handlePurchaseClick(course.amount, course.type)
                  }
                  className="w-full mt-4 py-2 bg-white text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-all duration-300 text-center"
                >
                  MUA GÓI NGAY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Course;
