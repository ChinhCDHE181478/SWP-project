"use client";

import Image from "next/image";

const ExamAndOrganizationContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn thi và tổ chức thi</div>
      <div>
        Để tham gia thi chính thức hoặc tổ chức thi trên EduTest, các bạn cần làm theo các bước hướng dẫn dưới đây:
        <div>
          <span className="font-bold">Bước 1: </span> Đăng ký tham gia thi chính thức. Truy cập mục <span className="font-bold">Thi và tổ chức thi</span> như hình dưới đây:
        </div>
      </div>
      <div>
        <Image
          src="/support/exam/exam-organization-pic1.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 2: </span>Điền thông tin đăng ký thi. Hệ thống sẽ yêu cầu bạn nhập thông tin như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/exam-organization-pic2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          1 - Nhập <span className="font-bold">Họ và tên</span> của bạn.
        </div>
        <div>
          2 - Chọn <span className="font-bold">Vòng thi</span> (ví dụ: Vòng 1, Vòng 2).
        </div>
        <div>
          3 - Nhấn <span className="font-bold">Đăng ký</span> để hoàn tất.
        </div>
      </div>
      <div>
        <span className="font-bold">Bước 3: </span>Chuẩn bị cho kỳ thi. Hệ thống sẽ gửi thông báo lịch thi và hướng dẫn như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/exam-organization-pic3.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 4: </span>Tham gia thi chính thức. Vào ngày thi, truy cập link thi và làm bài như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/exam-organization-pic4.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <span className="font-bold">Bước 5: </span>Xem kết quả thi. Sau khi thi xong, hệ thống sẽ hiển thị kết quả như hình dưới:
      </div>
      <div>
        <Image
          src="/support/exam/exam-organization-pic5.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
    </div>
  );
};

export default ExamAndOrganizationContent;