"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizDispatch, useQuizState } from "@/context/QuizProvider";
import { quizQuestions } from "@/lib/quizData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, TimerIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function QuizClient() {
  const { currentUser, currentQuiz } = useQuizState();
  const dispatch = useQuizDispatch();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizTime, setQuizTime] = useState(0); // total quiz time
  const [timeLeft, setTimeLeft] = useState(30); // per-question timer
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  // ✅ Force fullscreen + skip if user switches tab
  useEffect(() => {
    // enter fullscreen once
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
    else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
    else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen();

    // if user switches tab -> skip current question
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // mark as null if unanswered
        if (currentQuiz.answers[currentQuestionIndex] == null) {
          dispatch({
            type: "SUBMIT_ANSWER",
            payload: { questionIndex: currentQuestionIndex, answerIndex: null },
          });
        }

        // move to next
        if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(30);
        } else {
          handleSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentQuestionIndex, currentQuiz, dispatch]);

  // overall quiz time
  useEffect(() => {
    const timer = setInterval(() => setQuizTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // per-question countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const countdown = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timeLeft]);

  const handleTimeout = () => {
    if (currentQuiz.answers[currentQuestionIndex] == null) {
      dispatch({
        type: "SUBMIT_ANSWER",
        payload: { questionIndex: currentQuestionIndex, answerIndex: null },
      });
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    }
  };

  

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch({
      type: "SUBMIT_ANSWER",
      payload: { questionIndex: currentQuestionIndex, answerIndex },
    });
  };

  const handleSubmit = async () => {
    try {
      const score = currentQuiz.answers.reduce(
        (acc, ans, idx) =>
          ans === quizQuestions[idx].correctAnswer ? acc + 1 : acc,
        0
      );

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          srm_email: currentUser.email,
          score,
          timeTaken: quizTime,
          answers: currentQuiz.answers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit quiz");

      dispatch({ type: "FINISH_QUIZ" });
      router.push("/thankyou");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return "bg-green-500";
    if (timeLeft > 10) return "bg-yellow-400";
    if (timeLeft > 5) return "bg-orange-500";
    return "bg-red-600";
  };

  if (!currentUser || !currentQuiz) return null;

  const question = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-primary">Embedded Systems Quiz</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
                <TimerIcon className="h-5 w-5 text-primary" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${getTimerColor()}`}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold">{question.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  currentQuiz.answers[currentQuestionIndex] === index ? "default" : "outline"
                }
                className="h-auto min-h-16 justify-start text-left whitespace-normal"
                onClick={() => {
                  handleAnswerSelect(index);
                  handleNext();
                }}
              >
                <span className="mr-4 h-6 w-6 flex-shrink-0 rounded-full border border-primary flex items-center justify-center">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
         

          {currentQuestionIndex === quizQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Once you submit the quiz, you cannot go back and change your answers.
        </AlertDescription>
      </Alert>
    </div>
  );
}

