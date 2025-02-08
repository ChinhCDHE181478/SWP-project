import React from "react";

const News: React.FC = () => {
  // Sample news data with full day names and individual links for each item
  const newsData = {
    "Sự Kiện": [
      { date: "Thứ Sáu 24/1/25", title: "Ném Còn Cây Nêu, 'Nail All the Tests' - Học có mục tiêu, nhận quà siêu yêu từ IOE!", link: "/event1" },
      { date: "Thứ Ba 31/12/24", title: "Happy New Year: Sending Love to Everyone!", link: "/event2" },
      { date: "Thứ Hai 16/12/24", title: "Cùng IOE ôn tập kiểm tra học kỳ I", link: "/event3" },
    ],
    "Tips Học Tiếng Anh": [
      { date: "Thứ Năm 5/2/25", title: "Ném còn - Trò chơi dân gian ngày Tết", link: "/tip1" },
      { date: "Thứ Sáu 31/1/25", title: "Nguồn gốc, ý nghĩa và nghi thức dựng cây Nêu trong ngày Tết", link: "/tip2" },
      { date: "Thứ Ba 24/12/24", title: "Magical Christmas Wishes for Family, Friends, and Teachers", link: "/tip3" },
    ],
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8">
      <div className="flex justify-between gap-8">
        {/* Sự Kiện Section */}
        <div className="flex-1 block border-2 p-4 mb-8 hover:bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-4">
            <a href="/news">SỰ KIỆN</a>
          </h2>
          {newsData["Sự Kiện"].map((item, index) => (
            <a
              key={index}
              href={item.link} // Individual link for each news item
              className="block border-b-2 border-gray-200 py-4 mb-4 hover:bg-gray-100"
            >
              <div className="text-sm text-blue-500">{item.date}</div>
              <div className="text-lg font-semibold hover:text-orange-500">{item.title}</div>
            </a>
          ))}
        </div>

        {/* Tips Học Tiếng Anh Section */}
        <div className="flex-1 block border-2 p-4 mb-8 hover:bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-4">
            <a href="/tips">TIPS HỌC TIẾNG ANH</a>
          </h2>
          {newsData["Tips Học Tiếng Anh"].map((item, index) => (
            <a
              key={index}
              href={item.link} // Individual link for each news item
              className="block border-b-2 border-gray-200 py-4 mb-4 hover:bg-gray-100"
            >
              <div className="text-sm text-blue-500">{item.date}</div>
              <div className="text-lg font-semibold hover:text-orange-500">{item.title}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
