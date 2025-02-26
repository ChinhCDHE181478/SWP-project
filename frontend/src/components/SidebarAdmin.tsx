"use client";

import { useAuth } from "@/app/AuthProvider";
import useCurrentUser from "@/hooks/useCurrentUser";
import { User, FileText, HelpCircle, LifeBuoy, LogOut } from "lucide-react";

const items = [
  {
    title: "Users",
    url: "/manager/account-manager?content=User",
    icon: User,
  },
  {
    title: "Content manager",
    url: "/manager/account-manager?content=Content_Manager",
    icon: FileText,
  },
  {
    title: "Quiz manager",
    url: "/manager/account-manager?content=Quiz_Manager",
    icon: LifeBuoy,
  },
  {
    title: "Support manager",
    url: "/manager/account-manager?content=Support_Manager",
    icon: HelpCircle,
  },
];

export function SidebarAdmin() {
  const user = useCurrentUser();
  const { logout } = useAuth();
  const { isLoading } = useAuth();

  return (
    <div className="flex flex-col px-5 pt-10">
      <div className="text-xl px-2">Quản lý tài khoản</div>
      <div className="mb-10 p-2">
        {!isLoading && <div>Tài khoản: {user.data?.username}</div>}
      </div>
      {items.map((item, index) => {
        const Icon = item.icon; // Lấy icon từ item
        return (
          <a
            key={index}
            href={item.url}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <Icon className="w-5 h-5" />
            <span>{item.title}</span> 
          </a>
        );
      })}
      <a
        href="#"
        onClick={() => logout()}
        className="flex mt-10 items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span>Đăng xuất</span>
      </a>
    </div>
  );
}
