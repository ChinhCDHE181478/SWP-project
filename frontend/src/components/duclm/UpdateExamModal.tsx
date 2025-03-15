"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";

interface UpdateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshList: () => void;
    exam: any;
}

const UpdateExamModal: React.FC<UpdateExamModalProps> = ({ isOpen, onClose, refreshList, exam }) => {
    const { toast } = useToast();
    const [examName, setExamName] = useState<string>("");
    const [examStart, setExamStart] = useState<string>("");
    const [examEnd, setExamEnd] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [status, setStatus] = useState<string>("on");
    const [file, setFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    useEffect(() => {
        if (exam) {
            setExamName(exam.examName);
            setExamStart(exam.examStart);
            setExamEnd(exam.examEnd);
            setGrade(exam.grade);
            setStatus(exam.status);
        }
    }, [exam]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAudioFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("examName", examName);
            formData.append("examStart", examStart);
            formData.append("examEnd", examEnd);
            formData.append("grade", grade);
            formData.append("status", status);
    
            if (file) formData.append("file", file);
            if (audioFile) formData.append("audioZip", audioFile);
    
            const response = await API.put(`/exam/update/${exam.examId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (response.status === 200) {
                toast({
                    title: "Cập nhật thành công!",
                    description: "Thông tin kỳ thi đã được cập nhật.",
                    className: "text-white bg-green-500",
                });
                refreshList();
                onClose();
            }
        } catch (error) {
            console.error("Error updating exam:", error);
            toast({
                title: "Lỗi!",
                description: "Có lỗi xảy ra khi cập nhật kỳ thi.",
                className: "text-white bg-red-500",
            });
        }
    };
    

    const handleDownload = async (type: "excel" | "audio") => {
        if (!exam || !exam.examId) {
            toast({
                title: "Lỗi!",
                description: "Không tìm thấy ID kỳ thi.",
                className: "text-white bg-red-500",
            });
            return;
        }

        const apiUrl = type === "excel"
            ? `/exam/download-excel/${exam.examId}`
            : `/exam/download-audio/${exam.examId}`;

        try {
            const response = await API.get(apiUrl, {
                responseType: "blob", // Nhận phản hồi dưới dạng file blob
            });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", type === "excel" ? `exam_${exam.examId}.xlsx` : `audio_${exam.examId}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            toast({
                title: "Lỗi!",
                description: `Không thể tải file ${type === "excel" ? "Excel" : "Audio"}.`,
                className: "text-white bg-red-500",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle>Cập nhật kỳ thi</DialogTitle>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tên kỳ thi</label>
                        <input
                            type="text"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày bắt đầu</label>
                        <input
                            type="datetime-local"
                            value={examStart}
                            onChange={(e) => setExamStart(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày kết thúc</label>
                        <input
                            type="datetime-local"
                            value={examEnd}
                            onChange={(e) => setExamEnd(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Khối</label>
                        <input
                            type="text"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Trạng thái</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        >
                            <option value="on">Bật</option>
                            <option value="off">Tắt</option>
                        </select>
                    </div>

                    {/* Tải file */}
                    <div className="flex flex-col space-y-2">
                        <label className="block text-gray-700 font-medium">Tải lên file</label>
                        <input type="file" onChange={handleFileChange} className="border rounded p-2 w-full focus:outline-orange-500" />
                        {file && <p className="text-sm text-green-600">📄 Đã chọn: {file.name}</p>}
                    </div>

                    {/* Tải file âm thanh */}
                    <div className="flex flex-col space-y-2">
                        <label className="block text-gray-700 font-medium">Tải lên file âm thanh (tùy chọn)</label>
                        <input type="file" accept=".zip,.rar" onChange={handleAudioFileChange} className="border rounded p-2 w-full focus:outline-orange-500" />
                        {audioFile && <p className="text-sm text-green-600">🎵 Đã chọn: {audioFile.name}</p>}
                    </div>

                    {/* Nút tải file */}
                    <div className="flex space-x-2">
                        <Button type="button" className="bg-orange-500 hover:bg-blue-600 text-white px-4 py-2" onClick={() => handleDownload("excel")}>
                            📥 Tải Excel
                        </Button>
                        <Button type="button" className="bg-orange-500 hover:bg-purple-600 text-white px-4 py-2" onClick={() => handleDownload("audio")}>
                            🎵 Tải Audio
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">Cập nhật</Button>
                        <DialogClose asChild>
                            <Button type="button" onClick={onClose} className="border text-black hover:bg-gray-100">Đóng</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateExamModal;
