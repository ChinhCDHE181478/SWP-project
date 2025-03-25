"use client";

import Image from "next/image";

const PracticeTestContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn thi thử</div>
      <div>
        Để tham gia thi thử trên EduTest, các bạn học sinh cần làm theo các bước hướng dẫn dưới đây:
        <div>
          <span className="font-bold">Bước 1: </span> Truy cập vào mục thi thử từ menu chính. Nhấp vào <span className="font-bold">Thi thử</span> như hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/exam/practice-test-pic1.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 2: </span>Chọn đề thi thử phù hợp. Hệ thống sẽ hiển thị danh sách các đề thi như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/practice-test-pic2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Chọn <span className="font-bold">Đề thi</span> (ví dụ: Đề thi IOE Vòng 1, Vòng 2).
        </div>
        <div>
          2 - Nhấn <span className="font-bold">Bắt đầu thi</span> để vào bài thi.
        </div>
      </div>
      <div>
        <span className="font-bold">Bước 3: </span>Làm bài thi thử. Hệ thống sẽ hiển thị các câu hỏi và bạn cần hoàn thành trong thời gian quy định như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/practice-test-pic3.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 4: </span>Nộp bài và xem kết quả. Sau khi nộp bài, hệ thống sẽ hiển thị kết quả như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/practice-test-pic4.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Xem <span className="font-bold">Điểm số</span> và xếp hạng của bạn.
        </div>
        <div>
          2 - Nhấn <span className="font-bold">Xem chi tiết</span> để kiểm tra đáp án.
        </div>
      </div>
    </div>
  );
};

export default PracticeTestContent;