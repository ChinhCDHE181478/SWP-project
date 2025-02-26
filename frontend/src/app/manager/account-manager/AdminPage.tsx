"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ManagerListTable from "../../../components/ManagerListTable";
import { SidebarAdmin } from "../../../components/SidebarAdmin";
import UserListTable from "../../../components/UserListTable";

const validContents = [
  "User",
  "Quiz_Manager",
  "Content_Manager",
  "Support_Manager",
];

const AdminPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const content = searchParams.get("content") || "User";

  useEffect(() => {
    if (!validContents.includes(content)) {
      const newUrl = `${pathname}?content=User`;
      router.replace(newUrl);
    }
  }, [content, pathname, router]);

  const renderContent = () => {
    switch (content) {
      case "User":
        return <UserListTable role={content}/>;
      case "Quiz_Manager":
        return <ManagerListTable role={content} />;
      case "Content_Manager":
        return <ManagerListTable role={content} />;
      case "Support_Manager":
        return <ManagerListTable role={content} />;
      default:
        return <UserListTable role={content}/>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-[15%] border-r-2 border-gray-300/50 shadow-lg"><SidebarAdmin/></div>
      <div className="pt-10 px-40 w-[85%] border-l-2 border-gray-300/50 shadow-sm">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
