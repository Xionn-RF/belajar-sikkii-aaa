import React from 'react';
import { Subject, EducationLevel } from '../types';
import { getSubjectTopics } from '../data/subjects';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  level: EducationLevel;
  onSelect: (subject: Subject) => void;
  onQuickTopicSelect?: (subject: Subject, topic: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  level,
  onSelect,
  onQuickTopicSelect,
}) => {
  const topics = getSubjectTopics(subject, level);

  return (
    <div
      onClick={() => onSelect(subject)}
      className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Decorative Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${subject.gradient}`} />

      <div>
        {/* Icon & Title */}
        <div className="flex flex-col items-center justify-center text-center pt-2 mb-4">
          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700/60 text-slate-800 dark:text-white rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-xs border border-slate-100 dark:border-slate-600 group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 transition-transform">
            {subject.icon}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {subject.name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 line-clamp-1">
            {subject.description}
          </p>
        </div>

        {/* Popular Topics by Level */}
        <div className="mb-4">
          <div className="flex flex-wrap justify-center gap-1.5">
            {topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onQuickTopicSelect) {
                    onQuickTopicSelect(subject, topic);
                  } else {
                    onSelect(subject);
                  }
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700/60 dark:hover:bg-indigo-950/40 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 border border-slate-200/60 dark:border-slate-600 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-normal">
          <Sparkles className="w-3 h-3 text-amber-500" /> Guru {level}
        </span>
        <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 dark:bg-indigo-950/40 dark:group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white dark:text-indigo-300 dark:group-hover:text-white transition-all font-medium">
          <span>Pelajari</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
