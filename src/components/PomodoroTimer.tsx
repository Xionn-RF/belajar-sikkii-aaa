import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle2,
  Settings,
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: (sessionCount: number) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for bell alert
  useEffect(() => {
    // Gentle synthesized chime using Web Audio API
  }, []);

  // Set total duration based on mode
  const getModeDuration = (m: TimerMode) => {
    if (m === 'work') return workMinutes * 60;
    if (m === 'shortBreak') return shortBreakMinutes * 60;
    return longBreakMinutes * 60;
  };

  // Play chime sound when timer hits 0
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore if AudioContext is blocked
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playAlertSound();

      if (mode === 'work') {
        const nextCount = completedSessions + 1;
        setCompletedSessions(nextCount);
        if (onSessionComplete) onSessionComplete(nextCount);

        // Auto switch to short break or long break after 4 sessions
        if (nextCount % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(longBreakMinutes * 60);
        } else {
          setMode('shortBreak');
          setTimeLeft(shortBreakMinutes * 60);
        }
      } else {
        setMode('work');
        setTimeLeft(workMinutes * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workMinutes, shortBreakMinutes, longBreakMinutes, completedSessions, onSessionComplete, soundEnabled]);

  // Switch modes manually
  const handleSwitchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(workMinutes * 60);
    else if (newMode === 'shortBreak') setTimeLeft(shortBreakMinutes * 60);
    else setTimeLeft(longBreakMinutes * 60);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getModeDuration(mode));
  };

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = getModeDuration(mode);
  const progressPercent = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

  return (
    <div className="relative">
      {/* Compact Header Widget Trigger */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 pl-3 rounded-2xl shadow-xs">
        
        {/* Timer Display */}
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-xl ${
            mode === 'work'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
          }`}>
            {mode === 'work' ? <Timer className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
          </span>

          <div className="flex flex-col">
            <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {mode === 'work' ? 'Fokus Belajar' : mode === 'shortBreak' ? 'Istirahat Pendek' : 'Istirahat Panjang'}
            </span>
          </div>
        </div>

        {/* Quick Play/Pause Control */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600'
              : mode === 'work'
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title={isRunning ? 'Jeda Timer' : 'Mulai Timer'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Completed Session Badge */}
        {completedSessions > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[11px] flex items-center gap-1">
            🎯 {completedSessions}
          </span>
        )}

        {/* Expand Details/Settings Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg"
          title="Pengaturan Pomodoro"
        >
          <Settings className="w-4 h-4" />
        </button>

      </div>

      {/* Expanded Popover / Dropdown Panel */}
      {isExpanded && (
        <div className="absolute right-0 top-14 z-50 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 space-y-4 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h4 className="font-extrabold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Timer className="w-4 h-4 text-rose-500" /> Pengatur Waktu Pomodoro
            </h4>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => handleSwitchMode('work')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'work' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Fokus
            </button>
            <button
              onClick={() => handleSwitchMode('shortBreak')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Istirahat 1
            </button>
            <button
              onClick={() => handleSwitchMode('longBreak')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'longBreak' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Istirahat 2
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Progres Sesi</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  mode === 'work' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Custom Duration Config */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">
              Atur Durasi Waktu (Menit):
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <label className="block font-semibold mb-1 text-slate-500">Fokus</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={workMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 25;
                    setWorkMinutes(val);
                    if (mode === 'work' && !isRunning) setTimeLeft(val * 60);
                  }}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-500">Istirahat 1</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 5;
                    setShortBreakMinutes(val);
                    if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
                  }}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-500">Istirahat 2</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 15;
                    setLongBreakMinutes(val);
                    if (mode === 'longBreak' && !isRunning) setTimeLeft(val * 60);
                  }}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-900 dark:text-rose-200 flex items-center justify-between font-medium">
            <span>Sesi Fokus Selesai:</span>
            <span className="font-extrabold text-sm">{completedSessions} Sesi ({(completedSessions * workMinutes)} Menit)</span>
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="w-full py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Tutup Panel
          </button>
        </div>
      )}
    </div>
  );
};
