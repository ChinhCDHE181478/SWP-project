import SendSupportRequestForm from "@/components/SendSupportRequestForm";
import Link from "next/link";

const SendSupportRequest = () => {
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Gửi phiếu hỗ trợ
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"/support"}>Hỗ trợ</Link>
              <a href={"#"}>Gửi phiếu hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen flex justify-center items-center">
        <div className="w-[1050px] flex my-10">
          <div className="w-[70%] bg-slate-200">
            <SendSupportRequestForm/>
          </div>
          <div className="w-[30%]"></div>
        </div>
      </div>
    </div>
  );
};

export default SendSupportRequest;
