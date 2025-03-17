"use client";

import { useEffect, useState, useMemo } from "react";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Province {
    code: number;
    codename: string;
    name: string;
}

interface ExamResult {
    userExamId: number;
    name: string;
    province: string;
    examName: string;
    grade: string;
    score: number;
    timespent: number;
}

export default function ExamResults() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [province, setProvince] = useState<string>("");
    const [examName, setExamName] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/p/");
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await API.get("/user-exam/get-result", {
                params: { province: province || undefined, examName, grade },
            });
            const formattedResults = response.data.map((item: any) => ({
                userExamId: item.userExamId,
                name: item.user.name,
                province: item.user.province,
                examName: item.exam.examName,
                grade: item.exam.grade,
                score: item.score,
                timespent: item.totalTime,
            }));
            setResults(formattedResults);
        } catch (error) {
            console.error("Error fetching exam results:", error);
            toast({ title: "Lỗi khi tải kết quả!", className: "text-white bg-red-500" });
        } finally {
            setLoading(false);
        }
    };

    const isSearchDisabled = useMemo(() => {
        return !province && !examName && !grade;
    }, [province, examName, grade]);

    return (
        <div className="w-screen flex flex-col mb-20 items-center">
            <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
                <div className="w-[1050px] mt-10">
                    <div className="">
                        <div className="text-[20px] text-[#000000] font-medium">
                             Kết quả thi chính thức các cấp
                        </div>
                        <div className="text-sm custom-links text-[#505050]">
                            <Link href={"/"}>Trang chủ</Link>
                            <a href={"#"}>Kết quả thi chính thức các cấp</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen p-6">
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <select
                            className="border p-2 rounded w-full"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                        >
                            <option value="">Chọn tỉnh</option>
                            {provinces.map((p) => (
                                <option key={p.code} value={p.name}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border p-2 rounded w-full"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                        >
                            <option value="">Chọn kỳ thi</option>
                            <option value="Cấp Phường/Xã">Cấp Phường/Xã</option>
                            <option value="Cấp Quận/Huyện">Cấp Quận/Huyện</option>
                            <option value="Cấp Tỉnh/Thành phố">Cấp Tỉnh/Thành phố</option>
                        </select>

                        <input
                            className="border p-2 rounded w-full"
                            placeholder="Lớp"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />

                        <button
                            className={`w-full py-1 rounded text-white font-semibold transition ${isSearchDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                                }`}
                            onClick={fetchResults}
                            disabled={isSearchDisabled}
                        >
                            {loading ? "Đang tải..." : "Tìm kiếm"}
                        </button>
                    </div>


                </div>
                <div className="overflow-x-auto shadow-lg rounded-lg bg-white mt-8">
                    <table className="min-w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-center">ID</th>
                                <th className="px-6 py-3 text-center">Họ và Tên</th>
                                <th className="px-6 py-3 text-center">Tỉnh</th>
                                <th className="px-6 py-3 text-center">Kỳ Thi</th>
                                <th className="px-6 py-3 text-center">Lớp</th>
                                <th className="px-6 py-3 text-center">Điểm</th>
                                <th className="px-6 py-3 text-center">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {results.length > 0 ? (
                                results.map((result) => (
                                    <tr key={result.userExamId} className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-3 text-center">{result.userExamId}</td>
                                        <td className="px-6 py-3 text-center">{result.name}</td>
                                        <td className="px-6 py-3 text-center">{result.province}</td>
                                        <td className="px-6 py-3 text-center">{result.examName}</td>
                                        <td className="px-6 py-3 text-center">{result.grade}</td>
                                        <td className="px-6 py-3 text-center">{result.score}</td>
                                        <td className="px-6 py-3 text-center">{result.timespent} giây</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}