"use client";

import React, { useState } from "react";
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

interface AddExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshList: () => void;
}

const AddExamModal: React.FC<AddExamModalProps> = ({ isOpen, onClose, refreshList }) => {
    const { toast } = useToast();
    const [examName, setExamName] = useState<string>("");
    const [examStart, setExamStart] = useState<string>("");
    const [examEnd, setExamEnd] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [status, setStatus] = useState<string>("on");
    const [file, setFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null); // Thêm trạng thái cho tệp âm thanh

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
            if (audioFile) formData.append("audioZip", audioFile); // Thêm tệp âm thanh vào formData

            const response = await API.post("/exam/upload-exam", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast({
                    title: "Thành công!",
                    description: "Đã thêm kỳ thi mới.",
                    className: "text-white bg-green-500",
                });

                refreshList();
                onClose();
            }
        } catch (error) {
            toast({
                title: "Lỗi!",
                description: "Không thể thêm kỳ thi.",
                className: "text-white bg-red-500",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle>Thêm kỳ thi</DialogTitle>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block mb-1">Tên kỳ thi</label>
                        <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Ngày bắt đầu</label>
                        <input type="datetime-local" value={examStart} onChange={(e) => setExamStart(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Ngày kết thúc</label>
                        <input type="datetime-local" value={examEnd} onChange={(e) => setExamEnd(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Khối</label>
                        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    {/* Status */}
                    <div className="mb-4">
                        <label className="block mb-1">Trạng thái</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border rounded p-2 w-full"
                        >
                            <option value="on">Bật</option>
                            <option value="off">Tắt</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Tải lên file</label>
                        <input type="file" onChange={handleFileChange} className="w-full border rounded p-2" />
                        {file && (
                            <p className="text-sm text-green-600 mt-1">
                                📄 Đã chọn: {file.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Tải lên file âm thanh (RAR/ZIP)</label>
                        <input type="file" onChange={handleAudioFileChange} className="w-full border rounded p-2" accept=".zip,.rar" />
                        {audioFile && (
                            <p className="text-sm text-green-600 mt-1">
                                🎵 Đã chọn: {audioFile.name}
                            </p>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2">
                            Thêm kỳ thi
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" onClick={onClose} className="border text-black rounded-md px-4 py-2 hover:bg-gray-100">
                                Đóng
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddExamModal;