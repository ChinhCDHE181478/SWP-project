import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import LogoIcon from "@/components/LogoIcon";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = () => {
  return (
    <div className="w-screen bg-[url('/login/bg.jpg')] bg-cover bg-left bg-no-repeat md:justify-items-end justify-items-center">
      <div className="flex flex-col h-screen w-min-[350px] md:w-[700px] md:px-28 items-center justify-center md:mx-20">
        <Card className="px-10 py-10 max-w-3xl w-full rounded-lg dark bg-white lg:p-5 bg-opacity-55 backdrop-blur-lg">
          <CardHeader className="">
            <div className="flex justify-center items-center">
              <LogoIcon className="w-[150px] h-auto" />
            </div>
            <CardTitle className="font-bold text-3xl">Đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="justify-center">
            <p>
              Bạn đã có tài khoản?{" "}
              <span>
                <Link className="text-blue-500" href={"/login"}>Đăng nhập ngay</Link>
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default RegisterPage;
