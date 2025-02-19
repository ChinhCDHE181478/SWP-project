"use client";
import CommonInformationProfile from "@/components/CommonInformationProfile";
import SideBarProfile from "@/components/SideBarProfile";
import UserInformationProfile from "@/components/UserInformationProfile";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Profile = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();

  const content = searchParams.get("content") || "CommonInfo";

  const setContent = (newContent : string) => {
    const newUrl = `${pathname}?content=${newContent}`;
    router.push(newUrl, { scroll: false }); 
  };

  const renderContent = () => {
    switch (content) {
      case "CommonInfo":
        return <CommonInformationProfile user={user} />;
      case "UserInfo":
        return <UserInformationProfile user={user} />;
      case "Achievements":
      case "PurchaseHistory":
      default:
        return <CommonInformationProfile />;
    }
  };

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Profile
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <a href={"#"}>Profile</a>
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

export default Profile;
