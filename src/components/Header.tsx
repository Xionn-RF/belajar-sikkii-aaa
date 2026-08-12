import React from 'react';
import { EducationLevel } from '../types';
import { Moon, Sun, History, ArrowLeft } from 'lucide-react';
import { LevelClassSelector } from './LevelClassSelector';

interface HeaderProps {
  level: EducationLevel;
  setLevel: (lvl: EducationLevel) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeSubjectName?: string;
  onBackToSubjects?: () => void;
  onOpenHistory?: () => void;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  level,
  setLevel,
  darkMode,
  setDarkMode,
  activeSubjectName,
  onBackToSubjects,
  onOpenHistory,
  savedCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Back Button */}
        <div className="flex items-center gap-3">
          {activeSubjectName && onBackToSubjects && (
            <button
              onClick={onBackToSubjects}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
              title="Ganti Mata Pelajaran"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Ganti Pelajaran</span>
            </button>
          )}

          <div
            onClick={onBackToSubjects}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              BP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-extrabold tracking-tight text-indigo-900 dark:text-indigo-300">
                  Belajar Pintar
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  AI Guru
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Asisten Belajar Interaktif 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Level & Class Selector & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Interactive Compact Level/Class Selector */}
          <LevelClassSelector
            currentLevel={level}
            onSelectLevel={setLevel}
            variant="compact"
          />

          {/* History Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Riwayat Percakapan & Belajar"
            >
              <History className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
