"use client";

import Image from "next/image";

const LearnWithEduContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn học cùng EDU</div>
      <div>
        Để học cùng EDU trên EduTest, các bạn học sinh cần làm theo các bước hướng dẫn dưới đây:
        <div>
          <span className="font-bold">Bước 1: </span> Truy cập vào mục học cùng EDU từ menu chính. Nhấp vào <span className="font-bold">Học cùng EDU</span> như hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/exam/learn-with-edu-pic1.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 2: </span>Chọn khóa học phù hợp. Hệ thống sẽ hiển thị danh sách các khóa học như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/learn-with-edu-pic2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Chọn <span className="font-bold">Khóa học</span> (ví dụ: Tiếng Anh cơ bản, Nâng cao).
        </div>
        <div>
          2 - Nhấn <span className="font-bold">Tham gia</span> để bắt đầu học.
        </div>
      </div>
      <div>
        <span className="font-bold">Bước 3: </span>Tham gia bài học. Hệ thống sẽ hiển thị nội dung bài học như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/learn-with-edu-pic3.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 4: </span>Hoàn thành bài kiểm tra sau mỗi bài học. Hệ thống sẽ hiển thị bài kiểm tra như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/learn-with-edu-pic4.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Làm bài kiểm tra và nhấn <span className="font-bold">Nộp bài</span>.
        </div>
        <div>
          2 - Xem <span className="font-bold">Kết quả</span> và nhận phản hồi.
        </div>
      </div>
    </div>
  );
};

export default LearnWithEduContent;