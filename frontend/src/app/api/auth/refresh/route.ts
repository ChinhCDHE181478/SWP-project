import { REFRESH, VERIFY_TOKEN } from "@/helper/urlPath";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, res: NextResponse) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    if (!refreshToken) {
      redirect("/auth/login");
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}` + REFRESH,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { accessToken } = res.data;
      (await cookies()).set({
        name: "access_token",
        value: accessToken,
        httpOnly: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}` + VERIFY_TOKEN,
    {
      token: accessToken,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.data === false) {
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    if (!refreshToken) {
      redirect("/auth/login");
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}` + REFRESH,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { accessToken } = res.data;
      (await cookies()).set({
        name: "access_token",
        value: accessToken,
        httpOnly: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const resData = {
    accessToken: (await cookies()).get("access_token")?.value,
  };
  return new Response(JSON.stringify(resData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
