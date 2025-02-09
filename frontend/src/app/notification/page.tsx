// import { Bell, CheckCircle, XCircle } from "lucide-react";
// import Link from "next/link";

// const notifications = [
//     { id: 1, title: "New Message", description: "You have a new message from John.", time: "5 min ago", type: "info" },
//     { id: 2, title: "Payment Received", description: "You received $50 from Alice.", time: "1 hour ago", type: "success" },
//     { id: 3, title: "Failed Transaction", description: "Your payment was declined.", time: "2 hours ago", type: "error" },
//     { id: 4, title: "Reminder", description: "Meeting at 3 PM.", time: "Today", type: "info" },
// ];

// const NotificationPage = () => {
//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
//             <div className="bg-yellow-500 p-4 rounded-t-xl flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//                     <Bell className="w-6 h-6 text-white" /> Notifications
//                 </h2>
//             </div>
//             <div className="space-y-3">
//                 {notifications.map((notification) => (
//                     <div
//                         key={notification.id}
//                         className="flex items-center p-4 border rounded-lg shadow-sm"
//                     >
//                         {notification.type === "success" && (
//                             <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
//                         )}
//                         {notification.type === "error" && (
//                             <XCircle className="w-6 h-6 text-red-500 mr-3" />
//                         )}
//                         {notification.type === "info" && (
//                             <Bell className="w-6 h-6 text-blue-500 mr-3" />
//                         )}
//                         <div>
//                             <p className="font-medium">{notification.title}</p>
//                             <p className="text-sm text-gray-600">{notification.description}</p>
//                             <p className="text-xs text-gray-400">{notification.time}</p>
//                             <Link 
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default NotificationPage;


// pages/notification/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/longnt/Header";
import NotificationHeader from "@/components/longnt/notification/NotificationHeader";
import Footer from "@/components/longnt/Footer";
import NewsHeader from "@/components/longnt/notification/NewsHeader";
import NotificationList from "@/components/longnt/notification/NotificationList";
import Pagination from "@/components/longnt/notification/Pagination";

export default function NotificationPage() {

  // 🛠️ Khai báo state ngay trong component
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Giả sử có 5 trang

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NewsHeader />
      <NotificationHeader
        image="/images/banner.jpg"
        title="Tiêu đề của tin tức"
        description="Đây là phần mô tả ngắn cho tin tức chính."
      />
      <div className="container mx-auto p-4 flex-grow">
        <NotificationList />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      <Footer />
    </div>
  );
}