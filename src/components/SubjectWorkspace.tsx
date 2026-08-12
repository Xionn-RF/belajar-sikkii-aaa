import React, { useState, useEffect, useRef } from 'react';
import { Subject, EducationLevel, ChatMessage, PracticeProblem, QuizQuestion, TopicSummary, DifficultyLevel } from '../types';
import { getSubjectTopics } from '../data/subjects';
import { fetchChatMessage, fetchPracticeQuestions, fetchQuiz, fetchSummary, fetchStudyTips } from '../services/api';
import { MarkdownView } from './MarkdownView';
import { MathStepSolver } from './MathStepSolver';
import { ScienceLabSim } from './ScienceLabSim';
import { PomodoroTimer } from './PomodoroTimer';
import {
  MessageSquare,
  BookOpen,
  Award,
  Lightbulb,
  FileText,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  Search,
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  BarChart2,
  RefreshCw,
  PlusCircle,
  Save,
  Calculator,
  FlaskConical
} from 'lucide-react';

interface SubjectWorkspaceProps {
  subject: Subject;
  level: EducationLevel;
  initialTopic?: string;
  onBackToGrid: () => void;
  onSaveSession: (title: string, messages: ChatMessage[]) => void;
}

type WorkspaceTab = 'chat' | 'interactive' | 'practice' | 'summary' | 'quiz' | 'tips';


export const SubjectWorkspace: React.FC<SubjectWorkspaceProps> = ({
  subject,
  level,
  initialTopic = '',
  onBackToGrid,
  onSaveSession,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('chat');
  const [currentTopic, setCurrentTopic] = useState(initialTopic);
  const [topicInput, setTopicInput] = useState(initialTopic);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Practice State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Sedang');
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeProblem[]>([]);
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [openHintId, setOpenHintId] = useState<number | null>(null);
  const [openSolutionId, setOpenSolutionId] = useState<number | null>(null);

  // Summary State
  const [summaryData, setSummaryData] = useState<TopicSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Tips State
  const [studyTipsText, setStudyTipsText] = useState('');
  const [isTipsLoading, setIsTipsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  // Initial welcome message in Chat
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: `Halo! Saya adalah **Guru AI Spesialis ${subject.name}** untuk tingkat **${level}**. 

${currentTopic ? `Saat ini kita sedang membahas topik: **${currentTopic}**.\n\n` : ''}Apa yang ingin kamu pelajari hari ini? Kamu bisa:
- Menanyakan konsep materi yang belum kamu pahami
- Minta **contoh soal & pembahasan**
- Mencoba **Latihan Soal**, **Kuis**, atau **Rangkuman Materi** dari menu di atas.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
  }, [subject, level]);

  // Handle Search Topic submit
  const handleTopicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setCurrentTopic(topicInput.trim());
    
    // Add topic message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Saya ingin mempelajari topik: "${topicInput.trim()}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    fetchChatMessage(
      subject.name,
      level,
      [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      topicInput.trim()
    )
      .then((reply) => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `⚠️ Maaf: ${err.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      })
      .finally(() => setIsChatLoading(false));
  };

  // Send Chat Message
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setIsChatLoading(true);

    fetchChatMessage(
      subject.name,
      level,
      newMessages.map((m) => ({ role: m.role, content: m.content })),
      currentTopic
    )
      .then((reply) => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `⚠️ Maaf, terjadi masalah: ${err.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      })
      .finally(() => setIsChatLoading(false));
  };

  // Load Practice Questions
  const handleLoadPractice = (diff?: DifficultyLevel) => {
    const selectedDiff = diff || difficulty;
    setIsPracticeLoading(true);
    setOpenHintId(null);
    setOpenSolutionId(null);

    fetchPracticeQuestions(subject.name, level, selectedDiff, 3)
      .then((questions) => setPracticeQuestions(questions))
      .catch((err) => console.error(err))
      .finally(() => setIsPracticeLoading(false));
  };

  // Load Quiz
  const handleLoadQuiz = () => {
    setIsQuizLoading(true);
    setIsQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuizIndex(0);

    fetchQuiz(subject.name, level, currentTopic)
      .then((quiz) => setQuizQuestions(quiz))
      .catch((err) => console.error(err))
      .finally(() => setIsQuizLoading(false));
  };

  // Load Summary
  const handleLoadSummary = () => {
    setIsSummaryLoading(true);
    fetchSummary(subject.name, level, currentTopic)
      .then((sum) => setSummaryData(sum))
      .catch((err) => console.error(err))
      .finally(() => setIsSummaryLoading(false));
  };

  // Load Study Tips
  const handleLoadTips = () => {
    if (studyTipsText) return;
    setIsTipsLoading(true);
    fetchStudyTips(subject.name, level)
      .then((tips) => setStudyTipsText(tips))
      .catch((err) => console.error(err))
      .finally(() => setIsTipsLoading(false));
  };

  // Speech Readout Toggle
  const toggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung fitur membaca suara (Text-to-Speech).');
      return;
    }

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      // Remove markdown chars for speech
      const cleanText = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);

      setSpeakingMsgId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy text helper
  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Tab Switch
  const handleTabChange = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    if (tab === 'practice' && practiceQuestions.length === 0) {
      handleLoadPractice();
    } else if (tab === 'quiz' && quizQuestions.length === 0) {
      handleLoadQuiz();
    } else if (tab === 'summary' && !summaryData) {
      handleLoadSummary();
    } else if (tab === 'tips' && !studyTipsText) {
      handleLoadTips();
    }
  };

  // Calculate Quiz Score
  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 20; // 5 questions = 100 max
      }
    });
    return score;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Workspace Header & Action Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            {subject.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Ruang Belajar {subject.name}
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${subject.badgeBg}`}>
                {level}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Guru AI Spesialis Siap Membimbing & Mengajar Step-by-Step
            </p>
          </div>
        </div>

        {/* Quick Change / Save Session & Pomodoro Timer */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pomodoro Timer Widget */}
          <PomodoroTimer />

          <button
            onClick={() => onSaveSession(`Belajar ${subject.name} (${currentTopic || 'Umum'})`, messages)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors border border-emerald-200/80 dark:border-emerald-800"
            title="Simpan Percakapan ke Riwayat"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Sesi</span>
          </button>

          <button
            onClick={onBackToGrid}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ganti Mata Pelajaran</span>
          </button>
        </div>
      </div>

      {/* Topic Search Bar within Subject */}
      {(() => {
        const levelTopics = getSubjectTopics(subject, level);
        return (
          <>
            <form onSubmit={handleTopicSearch} className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={`Cari/tentukan topik ${subject.name} (${level}) contoh: ${levelTopics.slice(0, 2).join(', ')}...`}
                className="w-full pl-11 pr-28 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2 text-xs px-3.5 py-1.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Fokus Topik
              </button>
            </form>

            {/* Popular Topics Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold whitespace-nowrap">Topik {level}:</span>
              {levelTopics.map((top, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopicInput(top);
                    setCurrentTopic(top);
                    handleSendMessage(`Jelaskan topik "${top}" secara lengkap dan mudah dipahami.`);
                  }}
                  className={`px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
                    currentTopic === top
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {top}
                </button>
              ))}
            </div>
          </>
        );
      })()}

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => handleTabChange('chat')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'chat'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mulai Belajar (Tanya AI)</span>
        </button>

        <button
          onClick={() => handleTabChange('interactive')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'interactive'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {subject.id === 'matematika' ? (
            <Calculator className="w-4 h-4 text-blue-600" />
          ) : (
            <FlaskConical className="w-4 h-4 text-emerald-600" />
          )}
          <span>
            {subject.id === 'matematika'
              ? 'Modul Interaktif (Step-by-Step Solver)'
              : ['ipa', 'fisika', 'kimia', 'biologi'].includes(subject.id)
              ? 'Laboratorium Sains Virtual'
              : 'Modul Interaktif & Simulasi'}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('practice')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'practice'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Latihan Soal</span>
        </button>

        <button
          onClick={() => handleTabChange('summary')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'summary'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rangkum Materi</span>
        </button>

        <button
          onClick={() => handleTabChange('quiz')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'quiz'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Kuis Interaktif</span>
        </button>

        <button
          onClick={() => handleTabChange('tips')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'tips'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Tips Belajar</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="min-h-[480px]">

        {/* 1. CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[560px] shadow-xs overflow-hidden">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700/80 text-gray-900 dark:text-white rounded-bl-none border border-gray-200/60 dark:border-gray-600'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <MarkdownView content={msg.content} />
                    )}

                    {/* Message Actions */}
                    {msg.role === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-600 flex items-center justify-between text-xs text-gray-400 dark:text-gray-400">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSpeech(msg.id, msg.content)}
                            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title={speakingMsgId === msg.id ? 'Hentikan Suara' : 'Bacakan Suara'}
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-4 h-4 text-red-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(msg.id, msg.content)}
                            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Salin Teks"
                          >
                            {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-bounce">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 text-xs text-gray-500 dark:text-gray-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>Guru AI {subject.name} sedang menyusun penjelasan...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Preset Prompt Pills */}
            <div className="p-2 px-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-gray-400 font-semibold whitespace-nowrap">Pertanyaan Cepat:</span>
              <button
                onClick={() => handleSendMessage(`Berikan contoh soal ${subject.name} beserta pembahasannya yang mudah dipahami.`)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400 text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                💡 Contoh Soal & Pembahasan
              </button>
              <button
                onClick={() => handleSendMessage(`Jelaskan materi ini menggunakan analogi sehari-hari.`)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400 text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                🌟 Analogi Sederhana
              </button>
              <button
                onClick={() => handleSendMessage(`Saya punya soal PR yang membingungkan. Tolong bimbing saya memahaminya.`)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-400 text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                📚 Bimbingan Tugas PR
              </button>
            </div>

            {/* Input Box */}
            <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Tanyakan apa saja seputar ${subject.name}...`}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-hidden transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isChatLoading}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

        {/* 2. INTERACTIVE MODULES TAB (Math Step Solver & Science Lab) */}
        {activeTab === 'interactive' && (
          <div className="space-y-6">
            {subject.id === 'matematika' ? (
              <MathStepSolver level={level} />
            ) : ['ipa', 'fisika', 'kimia', 'biologi'].includes(subject.id) ? (
              <ScienceLabSim level={level} subjectId={subject.id} />
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                  <span>Pilih modul pembelajaran interaktif yang ingin kamu pelajari:</span>
                </div>
                <MathStepSolver level={level} />
                <ScienceLabSim level={level} subjectId={subject.id} />
              </div>
            )}
          </div>
        )}

        {/* 3. PRACTICE QUESTIONS TAB */}
        {activeTab === 'practice' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Latihan Soal {subject.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pilih tingkat kesulitan dan pelajari petunjuk serta pembahasan langkah demi langkah.
                </p>
              </div>

              {/* Difficulty Level Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">Tingkat:</span>
                {(['Mudah', 'Sedang', 'Sulit'] as DifficultyLevel[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff);
                      handleLoadPractice(diff);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      difficulty === diff
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {diff}
                  </button>
                ))}

                <button
                  onClick={() => handleLoadPractice()}
                  disabled={isPracticeLoading}
                  className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg text-gray-600 dark:text-gray-300 ml-2"
                  title="Acak Soal Baru"
                >
                  <RefreshCw className={`w-4 h-4 ${isPracticeLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {isPracticeLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium">Membuat latihan soal tingkat {difficulty}...</p>
              </div>
            ) : practiceQuestions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Belum ada latihan soal yang dimuat.</p>
                <button
                  onClick={() => handleLoadPractice()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Muat Latihan Soal
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {practiceQuestions.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                        Soal #{index + 1} • {item.title || difficulty}
                      </span>
                      <span className="text-xs text-gray-400">Kesulitan: {item.difficulty || difficulty}</span>
                    </div>

                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                      {item.problem}
                    </p>

                    {/* Hint / Petunjuk Toggle */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => setOpenHintId(openHintId === index ? null : index)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{openHintId === index ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk (Hint)'}</span>
                      </button>

                      <button
                        onClick={() => setOpenSolutionId(openSolutionId === index ? null : index)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{openSolutionId === index ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan Lengkap'}</span>
                      </button>
                    </div>

                    {/* Hint Box */}
                    {openHintId === index && (
                      <div className="p-3 rounded-lg bg-amber-100/60 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed border border-amber-200 dark:border-amber-800/60">
                        💡 <strong>Petunjuk:</strong> {item.hint}
                      </div>
                    )}

                    {/* Solution Box */}
                    {openSolutionId === index && (
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-gray-800 dark:text-gray-200 text-xs leading-relaxed border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                        <strong className="text-emerald-700 dark:text-emerald-400 block text-sm">
                          ✅ Pembahasan Langkah demi Langkah:
                        </strong>
                        <MarkdownView content={item.solution} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SUMMARY TAB (Rangkum Materi) */}
        {activeTab === 'summary' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> Rangkuman Materi {subject.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Poin-poin penting, konsep dasar, dan rumus praktis untuk hafalan cepat.
                </p>
              </div>

              <button
                onClick={handleLoadSummary}
                disabled={isSummaryLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSummaryLoading ? 'animate-spin' : ''}`} />
                <span>Buat Rangkuman Baru</span>
              </button>
            </div>

            {isSummaryLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium">Menyusun rangkuman materi terstruktur...</p>
              </div>
            ) : !summaryData ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm mb-4">Belum ada rangkuman dimuat.</p>
                <button onClick={handleLoadSummary} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                  Rangkum Materi Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Topic Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-white/20 px-2 py-0.5 rounded">
                    Topik Rangkuman
                  </span>
                  <h4 className="text-lg font-bold mt-1">{summaryData.topic || subject.name}</h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">{summaryData.summaryText}</p>
                </div>

                {/* Key Points Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" /> Poin-Poin Penting
                    </h5>
                    <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      {summaryData.keyPoints?.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" /> Rumus / Kata Kunci
                    </h5>
                    <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      {summaryData.formulasOrConcepts?.map((fc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span className="font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">{fc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                  <h5 className="font-bold flex items-center gap-1.5 text-sm">
                    💡 Trik Cepat Mengingat:
                  </h5>
                  <ul className="list-disc ml-5 space-y-1">
                    {summaryData.quickTips?.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. QUIZ TAB (Kuis Interaktif) */}
        {activeTab === 'quiz' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" /> Kuis Interaktif {subject.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uji pemahamanmu dengan 5 pertanyaan pilihan ganda.
                </p>
              </div>

              <button
                onClick={handleLoadQuiz}
                disabled={isQuizLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isQuizLoading ? 'animate-spin' : ''}`} />
                <span>Kuis Baru</span>
              </button>
            </div>

            {isQuizLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium">Membuat soal kuis interaktif...</p>
              </div>
            ) : quizQuestions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm mb-4">Kuis belum dibuat.</p>
                <button onClick={handleLoadQuiz} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                  Mulai Kuis Sekarang
                </button>
              </div>
            ) : isQuizSubmitted ? (
              /* Quiz Score Result View */
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center text-3xl font-black mx-auto shadow-inner">
                  {calculateScore()}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculateScore() >= 80 ? '🎉 Luar Biasa!' : calculateScore() >= 60 ? '👍 Bagus Sekali!' : '💪 Tetap Semangat!'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Kamu berhasil menjawab dengan benar untuk {calculateScore() / 20} dari {quizQuestions.length} soal.
                  </p>
                </div>

                {/* Question Review Breakdown */}
                <div className="text-left space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Evaluasi & Pembahasan:</h5>
                  {quizQuestions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-xs space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>Soal #{idx + 1}: {q.question}</span>
                          <span>{isCorrect ? '✅ Benar' : '❌ Salah'}</span>
                        </div>
                        <p>
                          Jawaban Kamu: <strong>{q.options[selectedAnswers[idx]] || 'Tidak Dijawab'}</strong>
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            Jawaban Benar: {q.options[q.correctIndex]}
                          </p>
                        )}
                        <p className="pt-1 text-gray-600 dark:text-gray-300 border-t border-gray-200/50">
                          💡 <strong>Pembahasan:</strong> {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleLoadQuiz}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md"
                >
                  Coba Kuis Baru
                </button>
              </div>
            ) : (
              /* Active Quiz Question Runner */
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>Soal {currentQuizIndex + 1} dari {quizQuestions.length}</span>
                  <span>{Math.round(((currentQuizIndex + 1) / quizQuestions.length) * 100)}% Selesai</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Current Question */}
                {quizQuestions[currentQuizIndex] && (
                  <div className="space-y-4">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white leading-relaxed">
                      {quizQuestions[currentQuizIndex].question}
                    </h4>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {quizQuestions[currentQuizIndex].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuizIndex] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [currentQuizIndex]: optIdx }))
                            }
                            className={`w-full p-3.5 rounded-xl text-left text-sm font-medium border transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quiz Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setCurrentQuizIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuizIndex === 0}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  {currentQuizIndex < quizQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuizIndex((prev) => prev + 1)}
                      className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700"
                    >
                      Selanjutnya
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsQuizSubmitted(true)}
                      className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-md"
                    >
                      Kirim & Lihat Hasil Kuis
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. STUDY TIPS TAB */}
        {activeTab === 'tips' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Tips Belajar Efektif {subject.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Strategi khusus dari AI Guru untuk menguasai {subject.name} dengan lebih cepat dan menyenangkan.
                </p>
              </div>
            </div>

            {isTipsLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium">Menyusun tips belajar efektif...</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                <MarkdownView content={studyTipsText} />
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
