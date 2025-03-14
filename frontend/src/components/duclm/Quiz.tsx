"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Scoreboard from "./Scoreboard";

const Quiz: React.FC = () => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 phút
    const [quizState, setQuizState] = useState<"start" | "quiz" | "correct" | "wrong" | "finished">("start");
    const [dinosaurMessage, setDinosaurMessage] = useState("");

    const questions = [
        {
            question: "Câu hỏi 1?",
            answers: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
            correct: 1,
        },
        {
            question: "Câu hỏi 2?",
            answers: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
            correct: 3,
        },
    ];

    // Timer chạy liên tục cho đến khi quiz kết thúc
    useEffect(() => {
        if (quizState === "quiz" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0) {
            setQuizState("finished");
            setDinosaurMessage("Hết giờ! Xem kết quả nhé!");
            setTimeout(() => router.push("/practice"), 5000);
        }
    }, [quizState, timeLeft]);

    // Format thời gian
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    // Xử lý chọn đáp án
    const handleAnswer = (index: number) => {
        if (index === questions[currentQuestionIndex].correct) {
            setScore(score + 1);
            setDinosaurMessage("Bạn giỏi lắm!");
        } else {
            setDinosaurMessage("Ôi không! Đáp án sai rồi!");
        }

        // Chuyển sang câu tiếp theo hoặc kết thúc quiz
        if (currentQuestionIndex + 1 < questions.length) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setDinosaurMessage("");
            }, 1000);
        } else {
            setTimeout(() => {
                setQuizState("finished");
                setDinosaurMessage("Bạn đã hoàn thành quiz! Đang chuyển trang...");
                setTimeout(() => router.push("/practice"), 5000);
            }, 1000);
        }
    };

    return (
        <div className="bg-cover bg-center h-screen flex items-center justify-center relative text-white" style={{ backgroundImage: "url(/test/background.svg)" }}>
            {/* Hình khủng long */}
            <img src="/test/dinosaur.svg" alt="Dinosaur" className="absolute left-8 bottom-0 w-[450px]" />

            {/* Hộp thoại của khủng long */}
{dinosaurMessage && (
    <div className="absolute left-[160px] bottom-[320px] bg-white text-black border border-black rounded-lg p-4 shadow-lg text-center max-w-[280px] font-bold">
        <p className="m-0">{dinosaurMessage}</p>

        {/* Mũi nhọn hộp thoại */}
        <div className="absolute left-[50%] bottom-[-18px] w-0 h-0 
                        border-l-[10px] border-l-transparent 
                        border-r-[10px] border-r-transparent 
                        border-t-[14px] border-black"></div>

        <div className="absolute left-[50%] bottom-[-14px] w-0 h-0 
                        border-l-[10px] border-l-transparent 
                        border-r-[10px] border-r-transparent 
                        border-t-[14px] border-white"></div>
    </div>
)}


            {/* Scoreboard */}
            <div className="absolute top-4 right-4">
                <Scoreboard score={score} time={formatTime(timeLeft)} />
            </div>

            {/* Nội dung Quiz */}
            <div className="bg-black bg-opacity-50 rounded-lg p-10 shadow-lg text-center max-w-lg w-full">
                {quizState === "start" && (
                    <div>
                        <h2 className="text-2xl">Chào mừng đến với quiz!</h2>
                        <button className={buttonStyle} onClick={() => setQuizState("quiz")}>Bắt đầu</button>
                    </div>
                )}

                {quizState === "quiz" && (
                    <div>
                        <h2 className="text-2xl mb-4">{questions[currentQuestionIndex].question}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {questions[currentQuestionIndex].answers.map((answer, index) => (
                                <button key={index} className={buttonStyle} onClick={() => handleAnswer(index)}>
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {quizState === "finished" && (
                    <div>
                        <h2 className="text-2xl">Quiz hoàn thành!</h2>
                        <p className="text-lg">Điểm số của bạn: {score}/{questions.length}</p>
                        <p className="text-sm">Đang chuyển hướng đến trang Practice...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Style nút bấm
const buttonStyle = "bg-teal-600 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-teal-700";

export default Quiz;
