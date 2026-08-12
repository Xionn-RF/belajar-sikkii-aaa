import React, { useState, useEffect, useRef } from 'react';
import { EducationLevel, ScienceLabAnalysis } from '../types';
import { fetchScienceAnalysis } from '../services/api';
import {
  FlaskConical,
  Zap,
  Activity,
  Sun,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  Microscope,
  Flame,
  Droplets
} from 'lucide-react';

interface ScienceLabSimProps {
  level: EducationLevel;
  subjectId?: string;
}

type ScienceLabType = 'electric' | 'titration' | 'photosynthesis' | 'pendulum';

export const ScienceLabSim: React.FC<ScienceLabSimProps> = ({ level, subjectId }) => {
  // Determine default lab mode based on subject if provided
  const getDefaultLab = (): ScienceLabType => {
    if (subjectId === 'kimia') return 'titration';
    if (subjectId === 'biologi') return 'photosynthesis';
    if (subjectId === 'fisika') return 'electric';
    return 'electric';
  };

  const [activeLab, setActiveLab] = useState<ScienceLabType>(getDefaultLab());

  // --- 1. ELECTRIC CIRCUIT STATE ---
  const [voltage, setVoltage] = useState<number>(12);
  const [resistance1, setResistance1] = useState<number>(10);
  const [resistance2, setResistance2] = useState<number>(20);
  const [circuitType, setCircuitType] = useState<'seri' | 'paralel'>('seri');

  // --- 2. TITRATION STATE ---
  const [baseAddedMl, setBaseAddedMl] = useState<number>(0);
  const [isTitrating, setIsTitrating] = useState<boolean>(false);

  // --- 3. PHOTOSYNTHESIS STATE ---
  const [lightIntensity, setLightIntensity] = useState<number>(70);
  const [co2Level, setCo2Level] = useState<number>(3);
  const [waterTemp, setWaterTemp] = useState<number>(25);

  // --- 4. PENDULUM STATE ---
  const [pLength, setPLength] = useState<number>(2.0);
  const [pMass, setPMass] = useState<number>(2.0);
  const [pGravity, setPGravity] = useState<number>(9.8);
  const [isSwinging, setIsSwinging] = useState<boolean>(true);

  // --- AI ANALYSIS STATE ---
  const [aiAnalysis, setAiAnalysis] = useState<ScienceLabAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Electric Circuit Calculations
  const calcElectric = () => {
    let rTotal = 0;
    if (circuitType === 'seri') {
      rTotal = resistance1 + resistance2;
    } else {
      rTotal = (resistance1 * resistance2) / (resistance1 + resistance2);
    }
    const current = voltage / (rTotal || 1);
    const power = voltage * current;
    return { rTotal, current, power };
  };

  // Titration Calculations
  const calcTitration = () => {
    // 20ml HCl 0.1M titrated with NaOH 0.1M
    // Equivalence point at 20ml
    const vAcid = 20;
    const mAcid = 0.1;
    const mBase = 0.1;
    const molesAcid = vAcid * mAcid;
    const molesBase = baseAddedMl * mBase;

    let pH = 7;
    if (baseAddedMl === 0) {
      pH = 1; // pH of 0.1M HCl
    } else if (molesBase < molesAcid) {
      const remainingAcidMoles = molesAcid - molesBase;
      const totalVol = vAcid + baseAddedMl;
      const concH = remainingAcidMoles / totalVol;
      pH = Math.max(1, -Math.log10(concH));
    } else if (Math.abs(molesBase - molesAcid) < 0.01) {
      pH = 7; // neutral
    } else {
      const excessBaseMoles = molesBase - molesAcid;
      const totalVol = vAcid + baseAddedMl;
      const concOH = excessBaseMoles / totalVol;
      pH = Math.min(14, 14 - (-Math.log10(concOH)));
    }

    const isIndicatorPink = pH >= 8.2;
    return { pH: parseFloat(pH.toFixed(2)), isIndicatorPink };
  };

  // Photosynthesis Calculations
  const calcPhotosynthesis = () => {
    // Bubbles count per minute is affected by light, co2, and optimal temp (~25-30C)
    const tempFactor = Math.max(0, 1 - Math.abs(waterTemp - 28) / 25);
    const bubbleRate = Math.round((lightIntensity * 0.4 + co2Level * 10) * tempFactor);
    return { bubbleRate: Math.max(0, bubbleRate) };
  };

  // Pendulum Calculations
  const calcPendulum = () => {
    const period = 2 * Math.PI * Math.sqrt(pLength / pGravity);
    const frequency = 1 / period;
    return { period: parseFloat(period.toFixed(2)), frequency: parseFloat(frequency.toFixed(2)) };
  };

  // Titration Auto-Run Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTitrating && baseAddedMl < 40) {
      timer = setInterval(() => {
        setBaseAddedMl((prev) => {
          if (prev >= 40) {
            setIsTitrating(false);
            return 40;
          }
          return parseFloat((prev + 0.5).toFixed(1));
        });
      }, 200);
    } else {
      setIsTitrating(false);
    }
    return () => clearInterval(timer);
  }, [isTitrating, baseAddedMl]);

  // AI Analysis Trigger
  const handleRunAiAnalysis = () => {
    setIsAiLoading(true);
    setAiAnalysis(null);

    let labName = '';
    let vars: Record<string, any> = {};

    if (activeLab === 'electric') {
      const elec = calcElectric();
      labName = `Rangkaian Listrik ${circuitType.toUpperCase()} (Hukum Ohm)`;
      vars = { Voltase: `${voltage}V`, Resistor1: `${resistance1}Ω`, Resistor2: `${resistance2}Ω`, ArusTotal: `${elec.current.toFixed(2)}A`, Daya: `${elec.power.toFixed(2)}W` };
    } else if (activeLab === 'titration') {
      const titr = calcTitration();
      labName = 'Titrasi Asam-Basa (HCl vs NaOH)';
      vars = { VolumeNaOH: `${baseAddedMl} mL`, pH: titr.pH, IndikatorIndikasi: titr.isIndicatorPink ? 'Merah Muda' : 'Bening' };
    } else if (activeLab === 'photosynthesis') {
      const photo = calcPhotosynthesis();
      labName = 'Simulasi Fotosintesis Tumbuhan Air (Hydrilla)';
      vars = { IntensitasCahaya: `${lightIntensity}%`, KadarCO2: `${co2Level}%`, SuhuAir: `${waterTemp}°C`, GelembungO2PerMenit: photo.bubbleRate };
    } else if (activeLab === 'pendulum') {
      const pend = calcPendulum();
      labName = 'Ayunan Pendulum Sederhana (Gravitasi)';
      vars = { PanjangTali: `${pLength}m`, MassaBeban: `${pMass}kg`, Gravitasi: `${pGravity}m/s²`, Periode: `${pend.period}s`, Frekuensi: `${pend.frequency}Hz` };
    }

    fetchScienceAnalysis(labName, vars, 'Pengamatan eksperimen interaktif', level)
      .then((res) => setAiAnalysis(res))
      .catch((err) => console.error(err))
      .finally(() => setIsAiLoading(false));
  };

  const elec = calcElectric();
  const titr = calcTitration();
  const photo = calcPhotosynthesis();
  const pend = calcPendulum();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
      
      {/* Header & Lab Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Laboratorium Sains Virtual Interaktif
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulasikan reaksi kimia, fisika kelistrikan, & proses biologi secara aman dengan kontrol real-time.
          </p>
        </div>

        {/* Experiment Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveLab('electric')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeLab === 'electric'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Listrik Seri/Paralel
          </button>

          <button
            onClick={() => setActiveLab('titration')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeLab === 'titration'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> Titrasi pH Kimia
          </button>

          <button
            onClick={() => setActiveLab('photosynthesis')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeLab === 'photosynthesis'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Fotosintesis Biologi
          </button>

          <button
            onClick={() => setActiveLab('pendulum')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeLab === 'pendulum'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Pendulum Gravitasi
          </button>
        </div>
      </div>

      {/* 1. ELECTRIC CIRCUIT SIMULATION */}
      {activeLab === 'electric' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Panel Parameter Rangkaian</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                Hukum Ohm V = I × R
              </span>
            </h4>

            {/* Mode Toggle */}
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setCircuitType('seri')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  circuitType === 'seri' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Rangkaian Seri
              </button>
              <button
                onClick={() => setCircuitType('paralel')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  circuitType === 'paralel' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Rangkaian Paralel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Tegangan Baterai (Voltase V): {voltage} V
                </label>
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={voltage}
                  onChange={(e) => setVoltage(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Hambatan Resistor R1: {resistance1} Ω
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={resistance1}
                  onChange={(e) => setResistance1(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Hambatan Resistor R2: {resistance2} Ω
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={resistance2}
                  onChange={(e) => setResistance2(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Digital Meters */}
            <div className="p-4 bg-slate-900 text-amber-400 rounded-xl font-mono text-xs space-y-2 border border-slate-700">
              <div className="flex justify-between">
                <span>⚡ Total Hambatan (R_total):</span>
                <strong className="text-white">{elec.rTotal.toFixed(1)} Ω</strong>
              </div>
              <div className="flex justify-between text-cyan-400">
                <span>🔌 Kuat Arus Total (I = V / R):</span>
                <strong className="text-cyan-300">{elec.current.toFixed(2)} A</strong>
              </div>
              <div className="flex justify-between text-yellow-300">
                <span>💡 Total Daya Listrik (P = V × I):</span>
                <strong className="text-yellow-200">{elec.power.toFixed(1)} W</strong>
              </div>
            </div>
          </div>

          {/* SVG Visual Circuit */}
          <div className="lg:col-span-7 p-6 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative">
            <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Skema Visual Rangkaian {circuitType.toUpperCase()}
            </span>

            <svg viewBox="0 0 320 200" className="w-full max-w-sm h-52">
              {/* Battery */}
              <rect x="20" y="80" width="40" height="40" rx="6" fill="#f59e0b" />
              <text x="32" y="105" fill="#ffffff" fontSize="14" fontWeight="bold">+ -</text>
              <text x="22" y="135" fill="#f59e0b" fontSize="10" fontWeight="bold">{voltage}V</text>

              {/* Wire Loops */}
              {circuitType === 'seri' ? (
                <>
                  <path d="M 60 100 L 120 100 L 120 50 L 200 50 L 200 100 L 260 100 L 260 170 L 40 170 L 40 120" fill="none" stroke="#fbbf24" strokeWidth="3" />
                  
                  {/* Resistor 1 */}
                  <rect x="130" y="38" width="40" height="24" rx="4" fill="#3b82f6" />
                  <text x="140" y="54" fill="#fff" fontSize="10" fontWeight="bold">R1</text>

                  {/* Resistor 2 */}
                  <rect x="248" y="120" width="24" height="40" rx="4" fill="#3b82f6" />
                  <text x="252" y="144" fill="#fff" fontSize="10" fontWeight="bold">R2</text>
                </>
              ) : (
                <>
                  <path d="M 60 100 L 120 100" fill="none" stroke="#fbbf24" strokeWidth="3" />
                  <path d="M 120 50 L 120 150 L 200 150 L 200 50 Z" fill="none" stroke="#fbbf24" strokeWidth="3" />
                  <path d="M 200 100 L 260 100 L 260 170 L 40 170 L 40 120" fill="none" stroke="#fbbf24" strokeWidth="3" />

                  {/* Parallel R1 */}
                  <rect x="145" y="38" width="30" height="24" rx="4" fill="#3b82f6" />
                  <text x="152" y="54" fill="#fff" fontSize="10" fontWeight="bold">R1</text>

                  {/* Parallel R2 */}
                  <rect x="145" y="138" width="30" height="24" rx="4" fill="#3b82f6" />
                  <text x="152" y="154" fill="#fff" fontSize="10" fontWeight="bold">R2</text>
                </>
              )}

              {/* Light Bulb Glowing Circle */}
              <circle
                cx="260"
                cy="100"
                r="18"
                fill={elec.power > 0 ? `rgba(253, 224, 71, ${Math.min(1, elec.power / 50)})` : '#334155'}
                stroke="#eab308"
                strokeWidth="2"
              />
              <text x="254" y="104" fill="#000" fontSize="12">💡</text>
            </svg>

            <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
              <span>Kecepatan Arus: <strong>{(elec.current).toFixed(1)} A</strong></span>
              <span>Intensitas Lampu: <strong>{Math.round(Math.min(100, elec.power))}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 2. TITRATION SIMULATION */}
      {activeLab === 'titration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Kontrol Titrasi Buret</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300 font-bold">
                Asam HCl + Basa NaOH
              </span>
            </h4>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span>Volume Larutan HCl Awal:</span>
                <strong className="font-mono">20 mL (0.1 M)</strong>
              </div>
              <div className="flex justify-between text-fuchsia-600 dark:text-fuchsia-400 font-bold">
                <span>Titran NaOH Ditambahkan:</span>
                <strong className="font-mono">{baseAddedMl} mL</strong>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-extrabold text-sm border-t pt-2">
                <span>Nilai pH Larutan:</span>
                <strong className="font-mono">{titr.pH}</strong>
              </div>
            </div>

            {/* Titrate Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setBaseAddedMl((prev) => Math.min(40, parseFloat((prev + 1).toFixed(1))))}
                disabled={isTitrating}
                className="flex-1 py-2 bg-fuchsia-600 text-white rounded-xl text-xs font-bold hover:bg-fuchsia-700 transition-colors"
              >
                + 1 mL NaOH
              </button>
              <button
                onClick={() => setIsTitrating(!isTitrating)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors ${
                  isTitrating ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
              >
                {isTitrating ? 'Hentikan' : 'Tetes Otomatis'}
              </button>
              <button
                onClick={() => {
                  setBaseAddedMl(0);
                  setIsTitrating(false);
                }}
                className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
                title="Reset Eksperimen"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Color Indicator Card */}
            <div
              className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                titr.isIndicatorPink
                  ? 'bg-pink-200 text-pink-900 border-pink-400 dark:bg-pink-950 dark:text-pink-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Indikator PP: {titr.isIndicatorPink ? '🌸 Merah Muda (Basa/Titik Ekuivalen Tercapai!)' : '💧 Bening (Asam)'}
            </div>
          </div>

          {/* Flask Visual */}
          <div className="lg:col-span-7 p-6 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 220" className="w-full max-w-xs h-56">
              {/* Buret */}
              <rect x="94" y="10" width="12" height="90" fill="#94a3b8" rx="2" />
              <rect x="92" y="100" width="16" height="8" fill="#f43f5e" rx="2" />

              {/* Falling Drops Animation */}
              {isTitrating && (
                <circle cx="100" cy="115" r="3" fill="#38bdf8" className="animate-ping" />
              )}

              {/* Erlenmeyer Flask */}
              <polygon
                points="85,120 115,120 150,190 50,190"
                fill={titr.isIndicatorPink ? 'rgba(244, 114, 182, 0.6)' : 'rgba(186, 230, 253, 0.3)'}
                stroke="#38bdf8"
                strokeWidth="3"
              />
              <text x="80" y="210" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                pH: {titr.pH}
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* 3. PHOTOSYNTHESIS SIMULATION */}
      {activeLab === 'photosynthesis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Faktor Laju Fotosintesis</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
              </span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Intensitas Cahaya Lampu: {lightIntensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Kadar CO₂ Terlarut: {co2Level}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={co2Level}
                  onChange={(e) => setCo2Level(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Suhu Air: {waterTemp}°C
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={waterTemp}
                  onChange={(e) => setWaterTemp(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-200 rounded-xl text-xs space-y-1">
              <span className="font-extrabold uppercase text-[10px] text-emerald-400">Hasil Pengamatan:</span>
              <div className="text-lg font-black font-mono flex items-center gap-2">
                <span>{photo.bubbleRate} Gelembung O₂ / menit</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 200" className="w-full max-w-xs h-56">
              {/* Beaker Water */}
              <rect x="40" y="40" width="120" height="140" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="3" rx="8" />

              {/* Plant Hydrilla */}
              <path d="M 100 180 Q 90 140 100 100 Q 110 70 100 50" fill="none" stroke="#22c55e" strokeWidth="4" />
              <circle cx="88" cy="130" r="8" fill="#15803d" />
              <circle cx="112" cy="110" r="8" fill="#15803d" />
              <circle cx="92" cy="80" r="8" fill="#15803d" />

              {/* Rising O2 Bubbles */}
              {photo.bubbleRate > 0 && (
                <>
                  <circle cx="98" cy="90" r="4" fill="#ffffff" opacity="0.8" className="animate-bounce" />
                  <circle cx="104" cy="65" r="3" fill="#ffffff" opacity="0.8" className="animate-bounce" />
                </>
              )}
            </svg>
          </div>
        </div>
      )}

      {/* 4. PENDULUM SIMULATION */}
      {activeLab === 'pendulum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Parameter Ayunan</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 font-bold">
                T = 2π √(L/g)
              </span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Panjang Tali (L): {pLength} meter
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={pLength}
                  onChange={(e) => setPLength(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Lokasi Gravitasi (g):
                </label>
                <select
                  value={pGravity}
                  onChange={(e) => setPGravity(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value={9.8}>🌍 Bumi (9.8 m/s²)</option>
                  <option value={1.6}>🌕 Bulan (1.6 m/s²)</option>
                  <option value={24.8}>🪐 Yupiter (24.8 m/s²)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-cyan-300 rounded-xl font-mono text-xs space-y-1.5 border border-slate-700">
              <div className="flex justify-between">
                <span>Periode Ayunan (T):</span>
                <strong className="text-white">{pend.period} detik</strong>
              </div>
              <div className="flex justify-between">
                <span>Frekuensi (f = 1/T):</span>
                <strong className="text-white">{pend.frequency} Hz</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 200" className="w-full max-w-xs h-56">
              <line x1="20" y1="20" x2="180" y2="20" stroke="#94a3b8" strokeWidth="4" />
              <line x1="100" y1="20" x2="100" y2={30 + pLength * 25} stroke="#38bdf8" strokeWidth="2" />
              <circle cx="100" cy={30 + pLength * 25} r={8 + pMass} fill="#f43f5e" />
            </svg>
          </div>
        </div>
      )}

      {/* AI EXPERIMENT CONCLUSION BUTTON */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleRunAiAnalysis}
          disabled={isAiLoading}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{isAiLoading ? 'Menganalisis Hasil Eksperimen dengan AI...' : 'Minta Analisis & Kesimpulan Ilmiah AI'}</span>
        </button>

        {aiAnalysis && (
          <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{aiAnalysis.conceptName} ({aiAnalysis.keyScientificLaw})</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {aiAnalysis.analysisSummary}
            </p>
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white">Poin Pembelajaran Utama:</strong>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                {aiAnalysis.observationTakeaways?.map((take, i) => (
                  <li key={i}>{take}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
