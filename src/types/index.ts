export interface User {
  id: string;
  username: string;
  score: number;
}

export interface Question {
  id: string;
  type: 'text' | 'image';
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface QuizSession {
  userId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  startTime: Date;
  endTime?: Date;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Quiz: undefined;
  Leaderboard: undefined;
  Results: { score: number; total: number };
};
