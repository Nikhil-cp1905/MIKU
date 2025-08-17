export interface User {
  name: string;
  email: string;
  raNumber: string;
  phone: string;
}

export interface Participant extends User {
  score: number;
  timeTaken: number; // in seconds
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}
