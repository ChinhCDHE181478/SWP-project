"use client";
import SideBarProfile from "@/components/SideBarProfile";
import UserInformationProfile from "@/components/UserInformationProfile";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();

  const content = searchParams.get("content") || "UserInfo";

  const setContent = (newContent : string) => {
    const newUrl = `${pathname}?content=${newContent}`;
    router.push(newUrl, { scroll: false }); 
  };

  const renderContent = () => {
    switch (content) {
      case "UserInfo":
        return <UserInformationProfile user={user} />;
      case "Achievements":
      case "PurchaseHistory":
      default:
        return <UserInformationProfile user={user} />;
    }
  };

  return (
    <div className="w-screen flex flex-col mb-20 items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Hồ sơ
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <a href={"#"}>Hồ sơ</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1270px]">
        <div className="flex w-full mt-14">
          <div className="w-[20%]">
            <SideBarProfile user={user} setContent={setContent} />
          </div>

          <div className="ml-[5%] p-7 bg-white border rounded-lg shadow-lg w-[75%]">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
