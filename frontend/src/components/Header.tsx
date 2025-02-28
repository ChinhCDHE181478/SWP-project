"use client";
import { useAuth } from "@/app/AuthProvider";
import LogoIcon from "@/components/LogoIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ArrowDownIcon from "./ArrowDownIcon";

const Header = () => {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <div
        className="h-[120px] px-96 flex justify-between shadow-lg border-spacing-1"
        style={{ backgroundColor: "#F8AD2D" }}
      ></div>
      <div className="absolute left-1/2 min-w-[1000px] transform -translate-x-1/2 z-40">
        <div className="flex justify-between">
          <LogoIcon />
          <div className="flex nav-link-top mt-10 mr-5">
            <Link href={"/"}>Tự luyện</Link>
            <Link href={"/"}>Thi thử</Link>
            {!isLoading && isAuthenticated && (
              <>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  <FaUser className="mr-2 mt-[3px]" />
                </span>
                <Link href={"/profile"}>Tài khoản</Link>
                <a href={"#"} onClick={() => logout()}>
                  Đăng xuất
                </a>
              </>
            )}
            {!isLoading && !isAuthenticated && (
              <>
                <Link href={"/auth/login"}>Đăng nhập</Link>
                <Link href={"/auth/register"}>Đăng ký</Link>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-10 pt-2 top-[120px] h-[40px] bg-slate-50 text-black p-4 shadow-lg rounded-lg border-spacing-1 border-gray-300">
          {!isLoading && isAuthenticated && (
            <>
              <Link href={"/"}>Học sinh</Link>
            </>
          )}
          <Link href={"/"}>Hướng dẫn thi</Link>
          <Link href={"/"}>Kết quả thi</Link>
          <Link href={"/about-us"}>Về EduTest</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="pt-2 flex flex-row items-center">
              Tin tức
              <ArrowDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white pt-5 z-20">
              <DropdownMenuItem>
                <Link href={"/articles"}>Tin từ ban tổ chức</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/articles?type=tips&page=1"}>English Tips</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/news"}>Lịch thi</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default Header;
