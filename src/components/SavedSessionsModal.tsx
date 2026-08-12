import React from 'react';
import { SavedSession } from '../types';
import { X, History, Trash2, ArrowRight, BookOpen } from 'lucide-react';

interface SavedSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedSession[];
  onSelectSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
}

export const SavedSessionsModal: React.FC<SavedSessionsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Riwayat Belajar & Percakapan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sesi belajar yang telah kamu simpan sebelumnya
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Belum ada riwayat sesi yang disimpan.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Kamu dapat menekan tombol "Simpan Sesi" saat belajar untuk menyimpan percakapan penting.
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 hover:bg-white dark:hover:bg-slate-700/80 transition-all flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {session.subjectName}
                    </span>
                    <span className="text-[10px] text-slate-400">{session.level}</span>
                    <span className="text-[10px] text-slate-400">• {session.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {session.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {session.messages?.length || 0} Pesan Percakapan
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectSession(session);
                      onClose();
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Buka Sesi"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Hapus Sesi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
