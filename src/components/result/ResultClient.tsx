"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizState } from "@/context/QuizProvider";

export default function ResultClient() {
  const router = useRouter();
  const { quizStatus } = useQuizState();

  // Redirect if quiz is not completed
  useEffect(() => {
    if (quizStatus !== "completed") {
      router.push("/");
    }
  }, [quizStatus, router]);

  if (quizStatus !== "completed") {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Your Quiz Result</h1>
      {/* Display score and time here */}
    </div>
  );
}

