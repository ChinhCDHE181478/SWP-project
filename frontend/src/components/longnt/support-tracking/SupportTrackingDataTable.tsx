"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { SupportRequest } from "@/types/type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SupportTrackingDataTableProps {
  columns: ColumnDef<SupportRequest>[];
  data: SupportRequest[];
  fetchData: () => void;
  totalItems: number;
}

export function SupportTrackingDataTable({
  columns,
  data,
  fetchData,
  totalItems,
}: SupportTrackingDataTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null
  );

  // Sử dụng useMemo để đảm bảo dữ liệu bảng cập nhật khi selectedRequest thay đổi
  const tableData = useMemo(
    () => (selectedRequest ? [selectedRequest] : []),
    [selectedRequest]
  );

  // Cấu hình bảng từ react-table
  const table = useReactTable({
    data: tableData, // Dữ liệu bảng dựa trên tableData
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Mở modal hiển thị câu trả lời
  const openAnswerModal = (answer: string) => {
    setSelectedAnswer(answer || "Chưa có phản hồi");
    setOpen(true);
  };

  // Xử lý khi chọn một phiếu
  const handleSelectRequest = (request: SupportRequest) => {
    console.log("Selected request:", request); // Debug để kiểm tra
    setSelectedRequest(request); // Cập nhật phiếu được chọn
  };

  // Xử lý scroll để load thêm dữ liệu
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 1 &&
      data.length < totalItems
    ) {
      fetchData(); // Gọi lại fetchData để load thêm dữ liệu
    }
  };

  return (
    <div className="flex">
      {/* Viền xám bên trái */}
      <div className="w-1/5 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Phiếu của tui: {totalItems}</h2>
        <div
          className="space-y-2 overflow-y-auto max-h-[400px]"
          onScroll={handleScroll}
        >
          {data.map((request, index) => (
            <div
              key={request.id || index}
              className={`p-2 border rounded cursor-pointer ${
                selectedRequest?.id === request.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
              onClick={() => handleSelectRequest(request)}
            >
              Phiếu {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Nội dung chi tiết bên phải */}
      <div className="w-4/5 p-4">
        {selectedRequest ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Phiếu {data.findIndex((r) => r.id === selectedRequest.id) + 1}
            </h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          className="text-left p-3 bg-gray-100"
                          key={header.id}
                          // style={{ width: header.column.columnDef.size }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                      <TableHead className="text-left p-3 bg-gray-100">
                        Trả lời
                      </TableHead>
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="border-b">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell 
                          className="text-left p-3" 
                          key={cell.id}
                          style={{ width: cell.column.columnDef.size }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-left p-3">
                          <button
                            type="button"
                            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                            onClick={() =>
                              openAnswerModal(
                                row.original.supportAnswer || "Chưa có phản hồi"
                              )
                            }
                          >
                            Xem
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="h-24 text-center"
                      >
                        Không có kết quả.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Chọn một phiếu để xem chi tiết.</p>
        )}
      </div>

      {/* Modal hiển thị câu trả lời */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white p-4 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Câu trả lời yêu cầu hỗ trợ
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedRequest && (
              <>
                <p className="font-bold">Trả lời:</p>
                <p>{selectedAnswer}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupportTrackingDataTable;
