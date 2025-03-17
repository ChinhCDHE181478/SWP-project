"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { API } from "@/helper/axios";
import RightBoard from "./RightBoardExam";

interface Question {
  questionId: number;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  audioFile?: Uint8Array | null; // Thay đổi kiểu dữ liệu
}

interface ExamProps {
  questions: Question[];
  examID: number;
  wsUrl: string;
  examName: string;
  examType: string;
}

const DoExam: React.FC<ExamProps> = ({
  questions,
  examID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  examName,
  wsUrl,
  examType,
}) => {
  const user = useCurrentUser();
  const router = useRouter();
  const [userExamId, setUserExamId] = useState(-1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [quizState, setQuizState] = useState<"start" | "quiz" | "finished">(
    "start"
  );
  const [score, setScore] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentMessage, setStudentMessage] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const studentImages = [
    "/game4/type1.png",
    "/game4/type2.png",
    "/game4/type3.png",
    "/game4/type4.png",
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentImage, setStudentImage] = useState(
    studentImages[getRandomNumber()]
  );

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 4);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (
  //       event.key.startsWith("F") || // Chặn tất cả các phím F1 - F12
  //       event.ctrlKey // Chặn tất cả các tổ hợp với Ctrl
  //     ) {
  //       event.preventDefault();
  //       alert("Bạn không thể sử dụng phím này khi đang làm bài!");
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // // 🛑 Chặn thoát trang khi làm bài
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     event.returnValue = ""; // Chặn thoát trang mà không cần cảnh báo
  //     submit();
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  // // 👀 Phát hiện đổi tab hoặc ẩn trang
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       submit();
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // const enterFullScreen = () => {
  //   const elem = document.documentElement;
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } else if ((elem as any).mozRequestFullScreen) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     (elem as any).mozRequestFullScreen();
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } else if ((elem as any).webkitRequestFullscreen) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     (elem as any).webkitRequestFullscreen();
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } else if ((elem as any).msRequestFullscreen) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     (elem as any).msRequestFullscreen();
  //   }
  // };

  // useEffect(() => {
  //   enterFullScreen();
  // }, []);

  const handleStartExam = () => {
    if (stompClient && user.data?.id) {
      stompClient.publish({
        destination: "/app/start-exam",
        body: user.data.id + "-" + examID + "-" + examType,
      });
    }
    setQuizState("quiz"); // Chuyển trạng thái
  };

  useEffect(() => {
    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log("✅ WebSocket connected:", frame);
        const userQueue = `/user/queue/final-result`;
        client.subscribe(userQueue, (message) => {
          const updatedScore = parseInt(message.body, 10);
          console.log(`🔹 Received new score: ${updatedScore}`);
          if (!isNaN(updatedScore)) {
            setScore(updatedScore);
          }
        });
        client.subscribe(`/user/queue/exam-id`, (message) => {
          const uei = parseInt(message.body, 10);
          if (!isNaN(uei)) {
            setUserExamId(uei);
          }
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      console.log("Disconnected from WebSocket");
    };
  }, [wsUrl]);

  useEffect(() => {
    if (quizState === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeLeft]);

  const handleAnswer = (answer: string) => {
    if (hasAnswered || !stompClient) return;
    setHasAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const payload = `${currentQuestion.questionId}-${userExamId}-${answer}`;

    console.log(`📤 Sending answer: ${payload}`);
    stompClient.publish({
      destination: `/app/answer/${examType}`,
      body: payload,
    });
    handleAnswerFeedback();
  };

  const handleAnswerFeedback = () => {
    setHasAnswered(false);
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex + 1 < questions.length) {
        return prevIndex + 1;
      } else {
        setQuizState("finished");
        setStudentMessage("You have completed the quiz! Click OK to return.");
        submit();
        return prevIndex;
      }
    });
  };

  const handleAudioPlay = async () => {
    if (!questions[currentQuestionIndex].audioFile) {
      return;
    }

    const currentQuestionId = questions[currentQuestionIndex].questionId;

    try {
      const response = await API.get(`/question/${currentQuestionId}`, {
        responseType: "blob", // Đảm bảo nhận dữ liệu dưới dạng blob
      });

      const audioBlob = response.data; // Lấy blob từ response
      const url = URL.createObjectURL(audioBlob); // Tạo URL từ blob

      const audio = new Audio(url);
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  const submit = async () => {
    if (!user.data?.id) return;
    if (hasAnswered || !stompClient) return;

    const timeTaken = 1800 - timeLeft;

    const payload = `${userExamId}-${timeTaken}-${examType}`;

    console.log(`📤 Sending submit: ${payload}`);
    stompClient.publish({
      destination: `/app/final-result`,
      body: payload,
    });
  };

  useEffect(() => {
    if (quizState === "quiz") {
      handleAudioPlay(); // Phát âm thanh khi câu hỏi thay đổi
    }
  }, [currentQuestionIndex, quizState]);

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center relative text-white"
      style={{ backgroundImage: "url(/game4/background.jpg)" }}
    >
      {/* Icon Listen */}
      {questions[currentQuestionIndex].audioFile && (
        <div className="absolute top-4 left-4">
          <button
            onClick={handleAudioPlay}
            className="bg-blue-500 rounded-full p-4 shadow-lg hover:shadow-xl transition"
          >
            <img src="/game3/loa.png" alt="Listen" className="w-10 h-10" />
          </button>
        </div>
      )}

      {quizState !== "start" && (
        <img
          src={studentImage}
          alt="Student"
          className="absolute left-8 bottom-0 w-[450px]"
        />
      )}

      {quizState === "quiz" && (
        <div className="absolute top-4 right-4">
          <RightBoard time={formatTime(timeLeft)} />
        </div>
      )}

      <div className="bg-blue-900 bg-opacity-90 rounded-lg p-10 shadow-lg text-center max-w-lg w-full">
        {quizState === "start" && (
          <div>
            <h2 className="text-2xl">Welcome to Practice 3!</h2>
            <img
              src={studentImage}
              alt="Student"
              className="mx-auto w-[200px] mb-5 mt-3"
            />
            <button className={buttonStyle} onClick={handleStartExam}>
              Start
            </button>
          </div>
        )}

        {quizState === "quiz" && (
          <div>
            <h2 className="text-2xl mb-4">
              {questions[currentQuestionIndex].questionText}
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                questions[currentQuestionIndex].choice1,
                questions[currentQuestionIndex].choice2,
                questions[currentQuestionIndex].choice3,
                questions[currentQuestionIndex].choice4,
              ].map((answer, index) => (
                <button
                  key={index}
                  className={buttonStyle}
                  onClick={() => handleAnswer(answer)}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {quizState === "finished" && (
          <div>
            <h2 className="text-2xl">Exam Completed!</h2>
            <p className="text-lg">
              Your score: {score}/{questions.length * 10}
            </p>
            <p className="text-lg">
              Completion Time: {formatTime(1800 - timeLeft)}
            </p>
            <button
              className={buttonStyle}
              onClick={() => {
                submit();
                router.push("/exam");
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle =
  "bg-blue-500 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-blue-600 shadow-lg";

export default DoExam;
