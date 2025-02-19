import { Separator } from "./ui/separator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserInformationProfile = ({ user }: any) => {
  const dateB: string = user.data?.birthDate ? String(user.data.birthDate) : "";
  let formattedDate = "";

  if (dateB) {
    const dateSplit = dateB.split("-");
    if (dateSplit.length === 3) {
      formattedDate = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-7">
      <div className="w-full grid grid-cols-3">
        <div className="flex justify-between px-3">
          <div>Tên: {user.data?.name}</div>
          <Separator orientation="vertical" className="bg-slate-400" />
        </div>
        <div className="flex justify-between px-3">
          <div>Giới tính: {user.data?.gender}</div>
          <Separator orientation="vertical" className="bg-slate-400" />
        </div>
        <div className="px-3">Ngày sinh: {formattedDate}</div>
      </div>
      <Separator className="bg-slate-400" />
      <div className="flex gap-5 items-center">
        <div>
          Email:{" "}
          {user.data?.email ? (
            <span>{user.data.email}</span>
          ) : (
            <span className="text-slate-400 italic">Chưa có email</span>
          )}
        </div>

        {user.data?.email ? (
          <button
            type="button"
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Xóa email
          </button>
        ) : (
          <button
            type="button"
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Thêm email
          </button>
        )}
      </div>
      <Separator className="bg-slate-400" />
      <div className="w-full grid grid-cols-2">
        <div className="flex justify-between">
          <div className="flex flex-col px-3 gap-7">
            <div>Tỉnh/Thành phố: {user.data?.province}</div>
            <div>Quận/Huyện: {user.data?.district}</div>
            <div>Phường/Xã: {user.data?.ward}</div>
          </div>
        </div>
        <div className="flex flex-col px-3 gap-7">
          <div className="px-3">Cấp: {user.data?.educationLevel}</div>
          <div className="px-3">Khối: {user.data?.grade}</div>
        </div>
      </div>

      <Separator className="bg-slate-400" />

      <div className="px-3">Loại tài khoản: {user.data?.accountType}</div>

      <div className="px-3 mt-5 flex gap-5">
        <button
          type="button"
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Sửa thông tin
        </button>
        <button
          type="button"
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default UserInformationProfile;
