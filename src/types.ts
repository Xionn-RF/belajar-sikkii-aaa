export type EducationLevel =
  | 'SMP'
  | 'SMP/MTs'
  | 'Kelas 7'
  | 'Kelas 8'
  | 'Kelas 9'
  | string;

export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit';

export type SubjectCategory = 'all' | 'mipa' | 'sosial' | 'bahasa' | 'umum';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  category: SubjectCategory;
  description: string;
  gradient: string;
  badgeBg: string;
  textColor: string;
  popularTopics: string[];
  popularTopicsByLevel?: {
    SD?: string[];
    SMP?: string[];
    'SMP/MTs'?: string[];
    SMA?: string[];
    'SMA/MA'?: string[];
    [key: string]: string[] | undefined;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'explanation' | 'quiz' | 'practice' | 'summary' | 'tips';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeProblem {
  id: number;
  title: string;
  difficulty: DifficultyLevel;
  problem: string;
  hint: string;
  solution: string;
}

export interface TopicSummary {
  topic: string;
  keyPoints: string[];
  formulasOrConcepts: string[];
  summaryText: string;
  quickTips: string[];
}

export interface SavedSession {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  level: EducationLevel;
  timestamp: string;
  messages: ChatMessage[];
}

export interface MathStep {
  stepNumber: number;
  stepTitle: string;
  mathExpression: string;
  explanation: string;
}

export interface MathStepSolution {
  problemSummary: string;
  givenValues: string[];
  formulaUsed: string;
  steps: MathStep[];
  finalAnswer: string;
  verificationTip: string;
}

export interface ScienceLabAnalysis {
  conceptName: string;
  keyScientificLaw: string;
  analysisSummary: string;
  observationTakeaways: string[];
  followUpQuestions: string[];
}

