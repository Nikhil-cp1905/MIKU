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
  const [time, setTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser || !currentQuiz) return null;

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch({
      type: "SUBMIT_ANSWER",
      payload: { questionIndex: currentQuestionIndex, answerIndex },
    });
  };

  // src/components/quiz/QuizClient.tsx
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
        timeTaken: time,
        answers: currentQuiz.answers,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to submit quiz");

    // Mark quiz finished
    dispatch({ type: "FINISH_QUIZ" });

    // Redirect to thank you page
    router.push("/thankyou");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
            <div className="flex items-center space-x-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
              <TimerIcon className="h-5 w-5 text-primary" />
              <span>{formatTime(time)}</span>
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
                onClick={() => handleAnswerSelect(index)}
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
          <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

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

