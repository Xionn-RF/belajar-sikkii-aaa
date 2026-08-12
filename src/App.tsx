import React, { useState, useEffect } from 'react';
import { EducationLevel, Subject, SavedSession, ChatMessage } from './types';
import { SUBJECTS } from './data/subjects';
import { Header } from './components/Header';
import { SubjectGrid } from './components/SubjectGrid';
import { SubjectWorkspace } from './components/SubjectWorkspace';
import { SavedSessionsModal } from './components/SavedSessionsModal';
import { Footer } from './components/Footer';

export default function App() {
  const [level, setLevel] = useState<EducationLevel>('Kelas 7 (SMP/MTs)');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('belajar_pintar_theme') === 'dark';
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [initialTopic, setInitialTopic] = useState<string>('');
  
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>(() => {
    try {
      const saved = localStorage.getItem('belajar_pintar_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync Dark Mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('belajar_pintar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('belajar_pintar_theme', 'light');
    }
  }, [darkMode]);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem('belajar_pintar_sessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  // Select subject from grid or search
  const handleSelectSubject = (subject: Subject, topic: string = '') => {
    setSelectedSubject(subject);
    setInitialTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to grid
  const handleBackToGrid = () => {
    setSelectedSubject(null);
    setInitialTopic('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save session to history
  const handleSaveSession = (title: string, messages: ChatMessage[]) => {
    if (!selectedSubject) return;

    const newSession: SavedSession = {
      id: Date.now().toString(),
      title,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      level,
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      messages,
    };

    setSavedSessions((prev) => [newSession, ...prev]);
    alert('Sesi belajar berhasil disimpan ke Riwayat!');
  };

  // Restore saved session
  const handleSelectSavedSession = (session: SavedSession) => {
    const matchedSubject = SUBJECTS.find((s) => s.id === session.subjectId) || SUBJECTS[0];
    setLevel(session.level);
    setSelectedSubject(matchedSubject);
    setInitialTopic('');
  };

  // Delete saved session
  const handleDeleteSession = (id: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Header Bar */}
      <Header
        level={level}
        setLevel={setLevel}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSubjectName={selectedSubject?.name}
        onBackToSubjects={selectedSubject ? handleBackToGrid : undefined}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedSessions.length}
      />

      {/* Main Container */}
      <main className="flex-1">
        {selectedSubject ? (
          <SubjectWorkspace
            key={selectedSubject.id}
            subject={selectedSubject}
            level={level}
            initialTopic={initialTopic}
            onBackToGrid={handleBackToGrid}
            onSaveSession={handleSaveSession}
          />
        ) : (
          <SubjectGrid
            level={level}
            setLevel={setLevel}
            onSelectSubject={handleSelectSubject}
          />
        )}
      </main>

      {/* History Drawer/Modal */}
      <SavedSessionsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={savedSessions}
        onSelectSession={handleSelectSavedSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
