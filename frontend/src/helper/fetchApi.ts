import { User } from "@/types/type";
import { GET_MANAGER, GET_USER } from "./urlPath";
import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getUser(page: number) {
  const res = await axios.get(apiURL + GET_USER, {
    headers: { "Content-Type": "application/json" },
    params: { page: page },
  });
  const data = await res.data;
  return data as User[];
}

export async function getManager(params: string) {
  const res = await axios.get(apiURL + GET_MANAGER, {
    headers: { "Content-Type": "application/json" },
    params: { type: params.toUpperCase() },
  });
  const data = await res.data;
  return data as User[];
}
