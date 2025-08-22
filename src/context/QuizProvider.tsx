"use client";

import { createContext, Dispatch, ReactNode, useContext, useReducer, useEffect, useState } from "react";
import type { Participant, User, Question } from "@/lib/types";
import { quizQuestions } from "@/lib/quizData";

type QuizStatus = "inactive" | "active";

type State = {
  quizStatus: QuizStatus;
  participants: Participant[];
  currentUser: User | null;
  currentQuiz: {
    answers: (number | null)[];
    startTime: number | null;
    endTime: number | null;
    totalQuestions: number;
  } | null;
};

type Action =
  | { type: "SET_STATE"; payload: Partial<State> }
  | { type: "TOGGLE_QUIZ_STATUS" }
  | { type: "REGISTER_USER"; payload: User }
  | { type: "START_QUIZ" }
  | { type: "SUBMIT_ANSWER"; payload: { questionIndex: number; answerIndex: number } }
  | { type: "FINISH_QUIZ" }
  | { type: "CLEAR_PARTICIPANTS" };

const initialState: State = {
  quizStatus: "active",
  participants: [],
  currentUser: null,
  currentQuiz: null,
};

function quizReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    case "TOGGLE_QUIZ_STATUS":
      return {
        ...state,
        quizStatus: state.quizStatus === "active" ? "inactive" : "active",
      };
    case "REGISTER_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "START_QUIZ":
      if (!state.currentUser) return state;
      return {
        ...state,
        currentQuiz: {
          answers: Array(quizQuestions.length).fill(null),
          startTime: Date.now(),
          endTime: null,
          totalQuestions: quizQuestions.length
        },
      };
    case "SUBMIT_ANSWER": {
      if (!state.currentQuiz) return state;
      const newAnswers = [...state.currentQuiz.answers];
      newAnswers[action.payload.questionIndex] = action.payload.answerIndex;
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          answers: newAnswers,
        },
      };
    }
    case "FINISH_QUIZ": {
      if (!state.currentUser || !state.currentQuiz || !state.currentQuiz.startTime) return state;
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - state.currentQuiz.startTime) / 1000);
      const score = state.currentQuiz.answers.reduce((acc, answer, index) => {
        if (answer === quizQuestions[index].correctAnswer) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const newParticipant: Participant = {
        ...state.currentUser,
        score,
        timeTaken,
      };

      return {
        ...state,
        participants: [...state.participants, newParticipant],
        currentQuiz: {
          ...state.currentQuiz,
          endTime,
        },
      };
    }
    case "CLEAR_PARTICIPANTS":
      return {
        ...state,
        participants: [],
      };
    default:
      return state;
  }
}

const QuizStateContext = createContext<State | undefined>(undefined);
const QuizDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const storedState = localStorage.getItem("quizState");
        if (storedState) {
          const parsedState = JSON.parse(storedState);
           // We don't want to persist admin auth status in the main quiz state
          if (parsedState.adminAuthenticated) {
            delete parsedState.adminAuthenticated;
          }
          dispatch({ type: "SET_STATE", payload: parsedState });
        }
      } catch (error) {
        console.error("Failed to parse state from localStorage", error);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("quizState", JSON.stringify(state));
    }
  }, [state, isClient]);

  return (
    <QuizStateContext.Provider value={state}>
      <QuizDispatchContext.Provider value={dispatch}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizStateContext.Provider>
  );
}

export function useQuizState() {
  const context = useContext(QuizStateContext);
  if (context === undefined) {
    throw new Error("useQuizState must be used within a QuizProvider");
  }
  return context;
}

export function useQuizDispatch() {
  const context = useContext(QuizDispatchContext);
  if (context === undefined) {
    throw new Error("useQuizDispatch must be used within a QuizProvider");
  }
  return context;
}
