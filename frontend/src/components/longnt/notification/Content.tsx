// "use client";

// import { useState, useEffect } from "react";
// import NotificationItem from "./NotificationItem";
// import { notifications as mockNotifications, Notification } from "@/data/notifications";

// export default function Content() {
//     const [notifications, setNotifications] = useState<Notification[]>([]);

//     useEffect(() => {
//         // Giả lập tải dữ liệu
//         setTimeout(() => {
//             setNotifications(mockNotifications);
//         }, 1000);
//     }, []);

//     return (
//         <main className="flex-1 p-4">
//             {notifications.length > 0 ? (
//                 notifications.map((notification) => (
//                     <NotificationItem key={notification.id} {...notification} />
//                 ))
//             ) : (
//                 <p>No notifications to display.</p>
//             )}
//         </main>
//     );
// }