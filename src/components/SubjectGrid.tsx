import React, { useState } from 'react';
import { SUBJECTS } from '../data/subjects';
import { Subject, SubjectCategory, EducationLevel } from '../types';
import { SubjectCard } from './SubjectCard';
import { LevelClassSelector } from './LevelClassSelector';
import { Search, Sparkles, BookOpen, Filter } from 'lucide-react';

interface SubjectGridProps {
  level: EducationLevel;
  setLevel: (lvl: EducationLevel) => void;
  onSelectSubject: (subject: Subject, topic?: string) => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  level,
  setLevel,
  onSelectSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('all');

  const categories: { id: SubjectCategory; label: string }[] = [
    { id: 'all', label: 'Semua Mata Pelajaran' },
    { id: 'mipa', label: 'MIPA & Sains' },
    { id: 'sosial', label: 'IPS & Sosial' },
    { id: 'bahasa', label: 'Bahasa & Sastra' },
    { id: 'umum', label: 'Umum & Agama' },
  ];

  // Filter subjects based on search query and category
  const filteredSubjects = SUBJECTS.filter((subject) => {
    const matchesCategory =
      selectedCategory === 'all' || subject.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      subject.name.toLowerCase().includes(query) ||
      subject.description.toLowerCase().includes(query) ||
      subject.popularTopics.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Hero Header */}
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pilih Mata Pelajaran
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
              Pilih pelajaran untuk jenjang <span className="font-bold text-indigo-600 dark:text-indigo-400">{level}</span> dan mulai belajar dengan AI Guru Pintar.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Kelas Aktif: <strong>{level}</strong></span>
          </div>
        </div>

        {/* Interactive Level & Class Selector with Separate Buttons for Each Class */}
        <LevelClassSelector
          currentLevel={level}
          onSelectLevel={setLevel}
          variant="full"
        />

        {/* Interactive Feature Cards (Math Solver & Virtual Science Lab Quick-Launch) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Math Solver Quick Entry */}
          <div
            onClick={() => {
              const mathSubject = SUBJECTS.find((s) => s.id === 'matematika') || SUBJECTS[0];
              onSelectSubject(mathSubject);
            }}
            className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all border border-blue-500 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                Modul Interaktif
              </span>
              <h3 className="text-lg font-bold flex items-center gap-2">
                📐 Matematika Step-by-Step
              </h3>
              <p className="text-xs text-blue-100 max-w-sm">
                Input nilai & dapatkan pembahasan aljabar, geometri, & persamaan kuadrat beserta diagram visual.
              </p>
            </div>
            <span className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform text-2xl shrink-0">
              ⚡
            </span>
          </div>

          {/* Science Lab Quick Entry */}
          <div
            onClick={() => {
              const scienceSubject = SUBJECTS.find((s) => s.id === 'ipa' || s.id === 'fisika') || SUBJECTS[1];
              onSelectSubject(scienceSubject);
            }}
            className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg transition-all border border-emerald-500 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                Simulasi Virtual
              </span>
              <h3 className="text-lg font-bold flex items-center gap-2">
                🔬 Laboratorium Sains Virtual
              </h3>
              <p className="text-xs text-emerald-100 max-w-sm">
                Simulasi interaktif listrik, titrasi pH kimia, fotosintesis, & pendulum gravitasi real-time.
              </p>
            </div>
            <span className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform text-2xl shrink-0">
              🧪
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative pt-2">

          <div className="relative flex items-center max-w-2xl">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi (misal: Hukum Newton, Grammar, Trigonometri)..."
              className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full hover:bg-slate-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap border-b border-slate-200 dark:border-slate-800 pb-4">
        <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Subject Grid List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Daftar Pelajaran ({filteredSubjects.length})
          </h3>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">
              Tidak ditemukan mata pelajaran dengan kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Tampilkan Semua Pelajaran
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                level={level}
                onSelect={(s) => onSelectSubject(s)}
                onQuickTopicSelect={(s, topic) => onSelectSubject(s, topic)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sleek Feature Banner / Live Stats */}
      <div className="mt-8 bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center font-bold text-xs">AS</div>
            <div className="w-9 h-9 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center font-bold text-xs">BD</div>
            <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center font-bold text-xs">CR</div>
          </div>
          <div>
            <p className="text-sm font-bold">1,240 Siswa sedang belajar sekarang</p>
            <p className="text-xs text-slate-400">Ayo tingkatkan prestasimu bersama Belajar Pintar AI!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-end">
          <div className="text-center sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Target Hari Ini</p>
            <p className="text-base font-bold text-indigo-300">3/5 Materi</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Poin Belajar</p>
            <p className="text-base font-bold text-amber-400">2,450 XP</p>
          </div>
        </div>
      </div>

    </div>
  );
};
