"use server";

import { cookies } from "next/headers";

interface StoreTokenRequest {
  token: string;
}

export async function storeToken(
  request: StoreTokenRequest,
  rememberMe: boolean
) {

  if (rememberMe) {
    (await cookies()).set({
      name: "token",
      value: request.token,
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    });
  } else {
    (await cookies()).set({
      name: "token",
      value: request.token,
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    });
  }
}
