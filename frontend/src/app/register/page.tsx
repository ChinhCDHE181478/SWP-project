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
    <div className="w-screen bg-[url('/login/bg2.jpg')] bg-cover bg bg-center md:bg-left bg-no-repeat md:justify-items-end justify-items-center">
      <div className="flex flex-col h-screen w-min-[350px] md:w-[700px] md:px-28 items-center justify-center">
        <Card className="px-10 py-10 max-w-3xl w-full rounded-lg dark bg-white p-0 lg:p-5">
          <CardHeader className="">
            <div className="flex justify-center items-center">
              <LogoIcon className="w-[150px] h-auto" />
            </div>
            <CardTitle className="font-bold text-3xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="justify-center">
            <p>
              Need an Account?{" "}
              <span>
                <Link href={"/register"}>Sign Up Now</Link>
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default RegisterPage;
