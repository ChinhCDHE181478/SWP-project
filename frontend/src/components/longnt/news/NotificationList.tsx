import React from "react";
import NotificationItem from "./NotificationItem";

// Định nghĩa kiểu cho dữ liệu NewsItem
interface NewsItem {
  id: number;
  date: string
  title: string;
  content: string;
  imageUrl: string;
}

interface NotificationListProps {
  events: NewsItem[]; // Dữ liệu bài viết
}

const NotificationList: React.FC<NotificationListProps> = ({ events }) => {

  if (!Array.isArray(events)) {
    return <div>No news available</div>; // Nếu không phải mảng, hiển thị thông báo
  }
  return (
    <div className="space-y-4">
      {/* Render từng NotificationItem cho mỗi item trong danh sách */}
      {events.map((item) => (
        <NotificationItem
          key={item.id}
          date={item.date} // Đảm bảo rằng mỗi item có key duy nhất
          title={item.title} // Truyền tiêu đề
          description={item.content} // Truyền nội dung
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default NotificationList;
