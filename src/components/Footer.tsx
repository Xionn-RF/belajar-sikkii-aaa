import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            BP
          </div>
          <span className="font-extrabold text-slate-900 dark:text-slate-200">
            Belajar Pintar
          </span>
          <span className="text-slate-400">— Asisten Belajar AI Pintar SMP / MTs (Kelas 7, 8, 9)</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Powered by Gemini AI
          </span>
          <span>© {new Date().getFullYear()} Belajar Pintar</span>
        </div>

      </div>
    </footer>
  );
};
