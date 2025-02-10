"use client";
import { useAuth } from "@/app/AuthProvider";
import LogoIcon from "@/components/LogoIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <div
        className="h-[120px] px-96 flex justify-between shadow-lg border-spacing-1"
        style={{ backgroundColor: "#F8AD2D" }}
      ></div>
      <div className="absolute left-1/2 w-[57.14%] transform -translate-x-1/2">
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
        <div className="flex justify-center gap-10 pt-2 top-[120px] h-[40px] bg-slate-50 text-black p-4 shadow-lg z-50 rounded-lg border-spacing-1 border-gray-300 z-[9999]">
          {!isLoading && isAuthenticated &&  (
            <>
              <Link href={"/"}>Học sinh</Link>
            </>
          )}
          <Link href={"/"}>Hướng dẫn thi</Link>
          <Link href={"/"}>Kết quả thi</Link>
          <Link href={"/about-us"}>Về EduTest</Link>
          <Link href={"/"}>Tin tức & Sự kiện</Link>
        </div>
      </div>
    </>
  );
};

export default Header;
