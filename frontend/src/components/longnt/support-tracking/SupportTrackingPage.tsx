"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SupportRequest } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { API } from "@/helper/axios";
import Pagination from "@/components/longnt/articles/Pagination";
import SupportTrackingDataTable from "./SupportTrackingDataTable";
import Link from "next/link";

const apiURL = process.env.NEXT_PUBLIC_API_URL;
const GET_SUPPORT_REQUESTS = "/support/user/requests";

// Hàm fetch API
async function getSupportRequests(
  userId: number,
  page: number = 1,
  pageSize: number = 5
) {
  const params: Record<string, string | number> = { userId, page, pageSize };
  const res = await API.get(`${apiURL}${GET_SUPPORT_REQUESTS}`, { params });
  return res.data;
}

// Định nghĩa cột
const supportRequestColumns: ColumnDef<SupportRequest>[] = [
  { accessorKey: "detail", header: "Yêu Cầu Hỗ Trợ Của Bạn",
    size: 400, 
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return value; 
    },
   },
  { accessorKey: "issueCategory", header: "Loại Hỗ Trợ" },
  { accessorKey: "dateCreated", header: "Ngày Tạo" },
];

const SupportTrackingPage = () => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);
  const userId = 2;

  const fetchSupportRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = Number(searchParams.get("page") || 1);
      const res = await getSupportRequests(userId, page, 5);

      setSupportRequests(res.supportRequests);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (error) {
      console.error("Error fetching support requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, userId]);

  useEffect(() => {
    fetchSupportRequests();
  }, [fetchSupportRequests]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="bg-slate-200 h-28 w-full flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div>
            <div className="text-[20px] text-[#000000] font-medium">
              Theo dõi phiếu
            </div>
            <div className="text-base text-[#505050] mt-1">
              <Link href="/" className="hover:underline">
                Trang chủ
              </Link>
              <span className="mx-1">/</span>
              <Link href="/support" className="hover:underline">
                Hỗ trợ
              </Link>
              <span className="mx-1">/</span>
              <a href={"#"}>Theo dõi phiếu</a>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="">
        <div className="w-[1050px] flex min-h-[60vh] items-stretch">
          {/* Bên trái: Danh sách phiếu */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[350x] flex flex-col gap-4">
              {isLoading && (
                <div className="flex justify-center items-center text-gray-500">
                  Loading...
                </div>
              )}
              {!isLoading && (
                <>
                  <SupportTrackingDataTable
                    columns={supportRequestColumns}
                    data={supportRequests}
                    fetchData={fetchSupportRequests}
                    totalItems={totalItems}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTrackingPage;
