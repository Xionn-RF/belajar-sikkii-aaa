import React, { useState } from 'react';
import { EducationLevel } from '../types';
import { GraduationCap, Check, ChevronDown, Sparkles } from 'lucide-react';

interface LevelClassSelectorProps {
  currentLevel: EducationLevel;
  onSelectLevel: (lvl: EducationLevel) => void;
  variant?: 'compact' | 'full';
}

export interface ClassOption {
  id: string;
  label: string;
  shortLabel: string;
  category: 'SMP/MTs';
}

export const CLASS_GROUPS: { category: 'SMP/MTs'; title: string; classes: ClassOption[] }[] = [
  {
    category: 'SMP/MTs',
    title: 'SMP / MTs',
    classes: [
      { id: 'Kelas 7 (SMP/MTs)', label: 'Kelas 7 (SMP/MTs)', shortLabel: 'Kelas 7', category: 'SMP/MTs' },
      { id: 'Kelas 8 (SMP/MTs)', label: 'Kelas 8 (SMP/MTs)', shortLabel: 'Kelas 8', category: 'SMP/MTs' },
      { id: 'Kelas 9 (SMP/MTs)', label: 'Kelas 9 (SMP/MTs)', shortLabel: 'Kelas 9', category: 'SMP/MTs' },
    ],
  },
];

export const LevelClassSelector: React.FC<LevelClassSelectorProps> = ({
  currentLevel,
  onSelectLevel,
  variant = 'full',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper to check if a class option is selected
  const isSelected = (clsId: string, clsShort: string) => {
    const cur = String(currentLevel);
    if (cur === clsId) return true;
    if (cur === clsShort) return true;
    if ((cur === 'SMP' || cur === 'SMP/MTs') && clsShort === 'Kelas 7') return true;
    return cur.toLowerCase().includes(clsShort.toLowerCase());
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-200 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-all shadow-xs"
          title="Klik untuk memilih kelas"
        >
          <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="truncate max-w-[150px] sm:max-w-none">
            {currentLevel || 'Kelas 7 (SMP/MTs)'}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Pilih Kelas SMP/MTs
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  {currentLevel}
                </span>
              </div>

              {/* Individual Class Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {CLASS_GROUPS[0].classes.map((cls) => {
                  const active = isSelected(cls.id, cls.shortLabel);
                  return (
                    <button
                      key={cls.id}
                      onClick={() => {
                        onSelectLevel(cls.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-105'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-300'
                      }`}
                    >
                      <span>{cls.shortLabel}</span>
                      {active && <Check className="w-3 h-3 mt-0.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-indigo-100 dark:border-slate-700/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Pilih Kelas Belajar Siswa (SMP / MTs)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih tombol kelas di bawah untuk menyesuaikan materi & tingkat kesulitan AI
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Kelas Terpilih: <strong className="text-indigo-900 dark:text-indigo-100">{currentLevel}</strong></span>
        </div>
      </div>

      {/* Class Selector Buttons */}
      <div className="pt-1">
        <div className="grid grid-cols-3 gap-3">
          {CLASS_GROUPS[0].classes.map((cls) => {
            const active = isSelected(cls.id, cls.shortLabel);
            return (
              <button
                key={cls.id}
                onClick={() => onSelectLevel(cls.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all border ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-102 ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300'
                }`}
              >
                <span>{cls.shortLabel} (SMP/MTs)</span>
                {active && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
