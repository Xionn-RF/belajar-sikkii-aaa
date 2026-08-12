import { ChatMessage, DifficultyLevel, EducationLevel, MathStepSolution, PracticeProblem, QuizQuestion, ScienceLabAnalysis, TopicSummary } from '../types';

export async function fetchChatMessage(
  subjectName: string,
  level: EducationLevel,
  messages: { role: string; content: string }[],
  topic?: string
): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectName, level, messages, topic }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal mengirim pesan ke AI.');
  }

  const data = await res.json();
  return data.reply;
}

export async function fetchTopicExplanation(
  subjectName: string,
  level: EducationLevel,
  topic: string
): Promise<string> {
  const res = await fetch('/api/ai/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectName, level, topic }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal mengambil penjelasan topik.');
  }

  const data = await res.json();
  return data.explanation;
}

export async function fetchPracticeQuestions(
  subjectName: string,
  level: EducationLevel,
  difficulty: DifficultyLevel,
  count = 3
): Promise<PracticeProblem[]> {
  const res = await fetch('/api/ai/practice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectName, level, difficulty, count }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memuat latihan soal.');
  }

  const data = await res.json();
  return data.questions || [];
}

export async function fetchQuiz(
  subjectName: string,
  level: EducationLevel,
  topic?: string
): Promise<QuizQuestion[]> {
  const res = await fetch('/api/ai/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectName, level, topic }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memuat kuis interaktif.');
  }

  const data = await res.json();
  return data.quiz || [];
}

export async function fetchSummary(
  subjectName: string,
  level: EducationLevel,
  topic?: string
): Promise<TopicSummary> {
  const res = await fetch('/api/ai/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectName, level, topic }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal membuat rangkuman materi.');
  }

  const data = await res.json();
  return data.summary;
}

export async function fetchStudyTips(
  subjectName: string,
  level: EducationLevel
): Promise<string> {
  const res = await fetch('/api/ai/tips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectName, level }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memuat tips belajar.');
  }

  const data = await res.json();
  return data.tips;
}

export async function fetchMathSolution(
  mathProblem: string,
  level: EducationLevel
): Promise<MathStepSolution> {
  const res = await fetch('/api/ai/math-solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mathProblem, level }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menyelesaikan soal matematika.');
  }

  const data = await res.json();
  return data.solution;
}

export async function fetchScienceAnalysis(
  labType: string,
  variables: Record<string, any>,
  observationNote: string,
  level: EducationLevel
): Promise<ScienceLabAnalysis> {
  const res = await fetch('/api/ai/science-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ labType, variables, observationNote, level }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menganalisis eksperimen sains.');
  }

  const data = await res.json();
  return data.analysis;
}

