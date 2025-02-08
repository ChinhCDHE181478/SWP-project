"use client";

import React from 'react';
import Slideshow from '../ui/SlideShow'; // Import the Slideshow component

const HomeInformation: React.FC = () => {
  // Array of images for the slideshow
  const images = [
    "/home/banner.avif",
  ];

  return (
    <div className="w-full h-full">

      {/* Existing Background Section */}
      <div
        className="relative w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(/home/background.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay to darken the background */}
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col justify-start lg:flex-row gap-8 px-8 lg:px-16 py-8">

          {/* Column 1: Greeting and Buttons */}
          <div className="flex flex-col justify-start items-center lg:items-start space-y-4 mt-[20px] w-full lg:w-1/3">
            {/* Title */}
            <div className="bg-black bg-opacity-50 p-4 text-left text-white border-l-4 border-yellow-500 pl-5 inline-block">
              <div className="text-xl lg:text-2xl font-normal uppercase tracking-wide">
                CHÀO MỪNG BẠN ĐẾN VỚI
              </div>
            </div>
            <div className="bg-black bg-opacity-50 p-4 text-left text-white border-l-4 border-yellow-500 pl-5 inline-block">
              <div className="text-3xl lg:text-4xl font-bold mt-2">
                TỰ LUYỆN EDUTEST VÒNG 24
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 w-full max-w-[200px]">
              <a href="#" className="bg-black bg-opacity-50 text-white font-bold py-2 px-4 text-center shadow-md border-l-4 border-pink-500 relative overflow-hidden group">
                <span className="relative z-10">Vào tự luyện ngay</span>
                <span className="absolute inset-0 bg-[#ffb74d] transform -translate-x-full group-hover:translate-x-0 transition-all duration-500"></span>
              </a>
              <a href="#" className="bg-black bg-opacity-50 text-white font-bold py-2 px-4 text-center shadow-md border-l-4 border-pink-500 relative overflow-hidden group">
                <span className="relative z-10">Lịch thi EduTest</span>
                <span className="absolute inset-0 bg-[#ffb74d] transform -translate-x-full group-hover:translate-x-0 transition-all duration-500"></span>
              </a>
              <a href="#" className="bg-black bg-opacity-50 text-white font-bold py-2 px-4 text-center shadow-md flex items-center justify-center border-l-4 border-pink-500 relative overflow-hidden group">
                <span className="relative z-10">Sự kiện</span>
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="absolute inset-0 bg-[#ffb74d] transform -translate-x-full group-hover:translate-x-0 transition-all duration-500"></span>
              </a>
            </div>
          </div>

          {/* Column 2: Banner - Use Slideshow component */}
          <div className='mt-[20px] w-full lg:w-1/3'>
            <Slideshow images={images} autoSlide={true} autoSlideInterval={5000}></Slideshow>
          </div>

          {/* Column 3: IOE Support */}
          <div className="bg-blue-500 text-white rounded-lg p-4 space-y-4 shadow-lg mt-[20px] w-full lg:w-1/3">
            <div className="font-bold text-lg">Hỗ trợ IOE</div>
            <button className="bg-pink-500 w-full py-2 rounded-lg text-white font-semibold hover:bg-pink-600">
              Gửi yêu cầu hỗ trợ
            </button>
            <div className="bg-white text-black rounded-lg p-2 font-medium">
              Olympic Tiếng Anh trên Internet - IOE
            </div>
            <div className="bg-white text-black rounded-lg p-2 font-medium">
              IOE.vn - Olympic Tiếng Anh trên Internet
            </div>
            <div className="bg-white text-black rounded-lg p-2 font-medium">
              1900.636.876 <br />
              Từ 8:30 đến 17:30 (T2-T6)
            </div>
            <div className="bg-white text-black rounded-lg p-2 font-medium">
              0984.650.154 <br />
              Từ 18:00 đến 21:00 (T2-T6)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeInformation;
