
import Link from "next/link";
const NewsHeader = () => {
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Tin tu Ban To Chuc
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"/"}>Tin tic</Link>
              <a href={"#"}>Tin tu Ban To Chuc</a>
            </div>
          </div>
        </div>
      </div>
      </div>
      );
};

      export default NewsHeader;