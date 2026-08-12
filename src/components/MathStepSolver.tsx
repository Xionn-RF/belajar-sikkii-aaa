import React, { useState } from 'react';
import { EducationLevel, MathStepSolution } from '../types';
import { fetchMathSolution } from '../services/api';
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Shapes,
  Compass,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

interface MathStepSolverProps {
  level: EducationLevel;
}

type MathTool = 'kuadrat' | 'geometri' | 'pythagoras' | 'spldv' | 'statistika' | 'custom';

export const MathStepSolver: React.FC<MathStepSolverProps> = ({ level }) => {
  const [activeTool, setActiveTool] = useState<MathTool>('kuadrat');

  // --- 1. Persamaan Kuadrat State ---
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  // --- 2. Geometri State ---
  const [shape, setShape] = useState<'lingkaran' | 'tabung' | 'segitiga' | 'kubus'>('lingkaran');
  const [geoRadius, setGeoRadius] = useState<number>(7);
  const [geoHeight, setGeoHeight] = useState<number>(10);
  const [geoBase, setGeoBase] = useState<number>(8);
  const [geoTriangleHeight, setGeoTriangleHeight] = useState<number>(6);

  // --- 3. Pythagoras State ---
  const [pythA, setPythA] = useState<number>(3);
  const [pythB, setPythB] = useState<number>(4);

  // --- 4. SPLDV State ---
  const [spldvA1, setSpldvA1] = useState<number>(2);
  const [spldvB1, setSpldvB1] = useState<number>(1);
  const [spldvC1, setSpldvC1] = useState<number>(7);
  const [spldvA2, setSpldvA2] = useState<number>(1);
  const [spldvB2, setSpldvB2] = useState<number>(-1);
  const [spldvC2, setSpldvC2] = useState<number>(2);

  // --- 5. Custom AI Solver State ---
  const [customProblem, setCustomProblem] = useState('');
  const [aiSolution, setAiSolution] = useState<MathStepSolution | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Quadratic Calculations
  const calcQuadratic = () => {
    const a = quadA || 1;
    const b = quadB || 0;
    const c = quadC || 0;
    const D = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = -(D) / (4 * a);

    let x1: string | number = '';
    let x2: string | number = '';
    let nature = '';

    if (D > 0) {
      x1 = ((-b + Math.sqrt(D)) / (2 * a)).toFixed(2);
      x2 = ((-b - Math.sqrt(D)) / (2 * a)).toFixed(2);
      nature = 'Dua akar real berbeda';
    } else if (D === 0) {
      x1 = (-b / (2 * a)).toFixed(2);
      x2 = x1;
      nature = 'Akar real kembar (sama)';
    } else {
      x1 = `${(-b / (2 * a)).toFixed(2)} + ${ (Math.sqrt(-D) / (2 * a)).toFixed(2) }i`;
      x2 = `${(-b / (2 * a)).toFixed(2)} - ${ (Math.sqrt(-D) / (2 * a)).toFixed(2) }i`;
      nature = 'Akar imajiner (kompleks)';
    }

    return { a, b, c, D, x1, x2, vertexX, vertexY, nature };
  };

  // Pythagoras Calculations
  const calcPythagoras = () => {
    const a = Math.abs(pythA || 3);
    const b = Math.abs(pythB || 4);
    const c = Math.sqrt(a * a + b * b);
    const angleA = (Math.atan(b / a) * (180 / Math.PI)).toFixed(1);
    const sinA = (b / c).toFixed(3);
    const cosA = (a / c).toFixed(3);
    const tanA = (b / a).toFixed(3);
    return { a, b, c: c.toFixed(2), angleA, sinA, cosA, tanA };
  };

  // Custom Solver Handler
  const handleSolveCustomMath = (problemToSolve?: string) => {
    const problem = problemToSolve || customProblem;
    if (!problem.trim()) return;

    setIsAiLoading(true);
    setAiError('');
    setAiSolution(null);

    fetchMathSolution(problem, level)
      .then((res) => {
        setAiSolution(res);
      })
      .catch((err) => {
        setAiError(err.message || 'Gagal memecahkan soal matematika.');
      })
      .finally(() => setIsAiLoading(false));
  };

  const quadRes = calcQuadratic();
  const pythRes = calcPythagoras();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
      
      {/* Header & Tool Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Modul Matematika Step-by-Step
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input nilai, lihat animasi/diagram visual, dan pelajari penjelasannya langkah demi langkah.
          </p>
        </div>

        {/* Sub-tools Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTool('kuadrat')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTool === 'kuadrat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            x² Persamaan Kuadrat
          </button>
          <button
            onClick={() => setActiveTool('geometri')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTool === 'geometri'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            📐 Geometri & Ruang
          </button>
          <button
            onClick={() => setActiveTool('pythagoras')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTool === 'pythagoras'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ⊿ Pythagoras & Trig
          </button>
          <button
            onClick={() => setActiveTool('custom')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTool === 'custom'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Soal AI Kustom
          </button>
        </div>
      </div>

      {/* 1. PERSAMAAN KUADRAT SOLVER */}
      {activeTool === 'kuadrat' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Inputs & Values */}
            <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" /> Form Input Parameter
              </h4>

              <div className="text-center font-mono text-lg font-extrabold bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">
                {quadA}x² {quadB >= 0 ? `+ ${quadB}` : `- ${Math.abs(quadB)}`}x {quadC >= 0 ? `+ ${quadC}` : `- ${Math.abs(quadC)}`} = 0
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Koefisien a
                  </label>
                  <input
                    type="number"
                    value={quadA}
                    onChange={(e) => setQuadA(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Koefisien b
                  </label>
                  <input
                    type="number"
                    value={quadB}
                    onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Konstanta c
                  </label>
                  <input
                    type="number"
                    value={quadC}
                    onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Slider Quick Tweaks */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                    <span>Atur a: {quadA}</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={quadA}
                    onChange={(e) => setQuadA(parseInt(e.target.value) || 1)}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                    <span>Atur b: {quadB}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={quadB}
                    onChange={(e) => setQuadB(parseInt(e.target.value) || 0)}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                    <span>Atur c: {quadC}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={quadC}
                    onChange={(e) => setQuadC(parseInt(e.target.value) || 0)}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {/* Summary Stats */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-xs space-y-1.5 text-blue-950 dark:text-blue-200 font-medium">
                <div className="flex justify-between">
                  <span>Nilai Diskriminan (D):</span>
                  <span className="font-bold">{quadRes.D}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sifat Akar:</span>
                  <span className="font-bold">{quadRes.nature}</span>
                </div>
                <div className="flex justify-between">
                  <span>Titik Puncak (Vertex):</span>
                  <span className="font-bold">({quadRes.vertexX.toFixed(2)}, {quadRes.vertexY.toFixed(2)})</span>
                </div>
              </div>

            </div>

            {/* Interactive SVG Parabola Graph & Steps */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* SVG Curve Plot */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Plot Kurva Parabola Y = {quadA}x² + {quadB}x + {quadC}
                </span>

                <svg viewBox="-100 -80 200 160" className="w-full h-48 max-w-md">
                  {/* Grid Lines */}
                  <line x1="-100" y1="0" x2="100" y2="0" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="-80" x2="0" y2="80" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Parabola Curve Generation */}
                  {(() => {
                    const points = [];
                    for (let x = -10; x <= 10; x += 0.2) {
                      const y = quadA * x * x + quadB * x + quadC;
                      // scale for SVG frame
                      const svgX = x * 8;
                      const svgY = -y * 2;
                      if (svgY >= -75 && svgY <= 75) {
                        points.push(`${svgX},${svgY}`);
                      }
                    }
                    return (
                      <polyline
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        points={points.join(' ')}
                      />
                    );
                  })()}

                  {/* Vertex Dot */}
                  <circle
                    cx={quadRes.vertexX * 8}
                    cy={-quadRes.vertexY * 2}
                    r="4"
                    fill="#f43f5e"
                  />
                </svg>

                <div className="flex items-center gap-4 text-[11px] text-slate-300 mt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Kurva Parabola
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Titik Puncak ({quadRes.vertexX.toFixed(1)}, {quadRes.vertexY.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Step-by-Step Breakdown Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Penjelasan Langkah demi Langkah
                </h4>

                {/* Step 1 */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    Langkah 1: Hitung Nilai Diskriminan (D)
                  </span>
                  <p className="font-mono text-slate-800 dark:text-slate-200">
                    D = b² - 4ac = ({quadB})² - 4({quadA})({quadC}) = {quadB * quadB} - ({4 * quadA * quadC}) = <strong>{quadRes.D}</strong>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Karena nilai D = {quadRes.D} ({quadRes.D > 0 ? 'D > 0' : quadRes.D === 0 ? 'D = 0' : 'D < 0'}), maka persamaan memiliki <strong>{quadRes.nature}</strong>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    Langkah 2: Terapkan Rumus ABC
                  </span>
                  <p className="font-mono text-slate-800 dark:text-slate-200">
                    x₁,₂ = [-b ± √D] / [2a] = [-({quadB}) ± √({quadRes.D})] / [2({quadA})]
                  </p>
                  <div className="pt-1 flex gap-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Akar x₁ = {quadRes.x1}</span>
                    <span>Akar x₂ = {quadRes.x2}</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    Langkah 3: Hitung Titik Puncak & Sumbu Simetri
                  </span>
                  <p className="font-mono text-slate-800 dark:text-slate-200">
                    Sumbu Simetri x = -b / (2a) = -({quadB}) / (2 × {quadA}) = <strong>{quadRes.vertexX.toFixed(2)}</strong>
                  </p>
                  <p className="font-mono text-slate-800 dark:text-slate-200">
                    Nilai Ekstrem y = -D / (4a) = -({quadRes.D}) / (4 × {quadA}) = <strong>{quadRes.vertexY.toFixed(2)}</strong>
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* 2. GEOMETRI & BANGUN RUANG */}
      {activeTool === 'geometri' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-slate-400 font-semibold">Pilih Bangun:</span>
            {[
              { id: 'lingkaran', name: '🔴 Lingkaran' },
              { id: 'tabung', name: '🛢️ Tabung' },
              { id: 'segitiga', name: '🔺 Segitiga' },
              { id: 'kubus', name: '🧊 Kubus' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setShape(s.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                  shape === s.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input & Calculator */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Dimensi & Parameter Bangun
              </h4>

              {shape === 'lingkaran' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Jari-jari (r): {geoRadius} cm
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={geoRadius}
                      onChange={(e) => setGeoRadius(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span>Diameter (d = 2r):</span>
                      <strong className="font-mono">{geoRadius * 2} cm</strong>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                      <span>Luas Lingkaran (L = πr²):</span>
                      <strong className="font-mono">{(Math.PI * geoRadius * geoRadius).toFixed(2)} cm²</strong>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Keliling (K = 2πr):</span>
                      <strong className="font-mono">{(2 * Math.PI * geoRadius).toFixed(2)} cm</strong>
                    </div>
                  </div>
                </div>
              )}

              {shape === 'tabung' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Jari-jari alas (r): {geoRadius} cm
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={geoRadius}
                      onChange={(e) => setGeoRadius(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Tinggi tabung (t): {geoHeight} cm
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={geoHeight}
                      onChange={(e) => setGeoHeight(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                      <span>Volume Tabung (V = πr²t):</span>
                      <strong className="font-mono">{(Math.PI * geoRadius * geoRadius * geoHeight).toFixed(2)} cm³</strong>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Luas Permukaan (Lp = 2πr(r+t)):</span>
                      <strong className="font-mono">{(2 * Math.PI * geoRadius * (geoRadius + geoHeight)).toFixed(2)} cm²</strong>
                    </div>
                  </div>
                </div>
              )}

              {shape === 'segitiga' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Alas (a): {geoBase} cm
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={geoBase}
                      onChange={(e) => setGeoBase(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Tinggi (t): {geoTriangleHeight} cm
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={geoTriangleHeight}
                      onChange={(e) => setGeoTriangleHeight(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                      <span>Luas Segitiga (L = ½ × a × t):</span>
                      <strong className="font-mono">{(0.5 * geoBase * geoTriangleHeight).toFixed(2)} cm²</strong>
                    </div>
                  </div>
                </div>
              )}

              {shape === 'kubus' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Sisi Rusuk (s): {geoRadius} cm
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={geoRadius}
                      onChange={(e) => setGeoRadius(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                      <span>Volume Kubus (V = s³):</span>
                      <strong className="font-mono">{Math.pow(geoRadius, 3)} cm³</strong>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Luas Permukaan (Lp = 6s²):</span>
                      <strong className="font-mono">{6 * geoRadius * geoRadius} cm²</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SVG Illustration */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded mb-4">
                Visualisasi Skala Bangun
              </span>

              {shape === 'lingkaran' && (
                <svg className="w-48 h-48">
                  <circle cx="96" cy="96" r={Math.min(80, geoRadius * 2.5)} fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="96" y1="96" x2={96 + Math.min(80, geoRadius * 2.5)} y2="96" stroke="#f43f5e" strokeWidth="2" />
                  <text x="110" y="90" fill="#f43f5e" fontSize="12" fontWeight="bold">r = {geoRadius} cm</text>
                </svg>
              )}

              {shape === 'tabung' && (
                <svg className="w-48 h-48">
                  <ellipse cx="96" cy="40" rx="60" ry="20" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="36" y1="40" x2="36" y2="150" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="156" y1="40" x2="156" y2="150" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx="96" cy="150" rx="60" ry="20" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="2" />
                  <text x="162" y="95" fill="#f43f5e" fontSize="12" fontWeight="bold">t = {geoHeight} cm</text>
                </svg>
              )}

              {shape === 'segitiga' && (
                <svg className="w-48 h-48">
                  <polygon points="96,20 20,160 172,160" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="96" y1="20" x2="96" y2="160" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="102" y="90" fill="#f43f5e" fontSize="12" fontWeight="bold">t = {geoTriangleHeight}</text>
                  <text x="80" y="175" fill="#38bdf8" fontSize="12" fontWeight="bold">a = {geoBase}</text>
                </svg>
              )}

              {shape === 'kubus' && (
                <svg className="w-48 h-48">
                  <rect x="30" y="50" width="100" height="100" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="2" />
                  <rect x="60" y="20" width="100" height="100" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
                  <line x1="30" y1="50" x2="60" y2="20" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="130" y1="50" x2="160" y2="20" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="30" y1="150" x2="60" y2="120" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="130" y1="150" x2="160" y2="120" stroke="#38bdf8" strokeWidth="2" />
                  <text x="70" y="165" fill="#38bdf8" fontSize="12" fontWeight="bold">s = {geoRadius} cm</text>
                </svg>
              )}

            </div>

          </div>
        </div>
      )}

      {/* 3. PYTHAGORAS & TRIGONOMETRI */}
      {activeTool === 'pythagoras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" /> Siku-Siku & Trigonometri
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Sisi Alas (a): {pythRes.a} cm
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={pythA}
                onChange={(e) => setPythA(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Sisi Tegak (b): {pythRes.b} cm
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={pythB}
                onChange={(e) => setPythB(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between font-bold text-rose-600 dark:text-rose-400">
                <span>Hipotenusa / Miring (c = √(a²+b²)):</span>
                <span className="font-mono">{pythRes.c} cm</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Sudut θ (theta):</span>
                <span className="font-mono font-bold">{pythRes.angleA}°</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono font-bold text-[11px]">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-700 dark:text-blue-300">
                  sin θ = {pythRes.sinA}
                </div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-700 dark:text-emerald-300">
                  cos θ = {pythRes.cosA}
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-700 dark:text-amber-300">
                  tan θ = {pythRes.tanA}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
            <svg className="w-56 h-48">
              <polygon
                points={`20,150 ${20 + pythRes.a * 5},150 20,${150 - pythRes.b * 4}`}
                fill="rgba(56,189,248,0.2)"
                stroke="#38bdf8"
                strokeWidth="3"
              />
              <text x={20 + (pythRes.a * 5) / 2} y="165" fill="#38bdf8" fontSize="12" fontWeight="bold">
                a = {pythRes.a}
              </text>
              <text x="5" y={150 - (pythRes.b * 4) / 2} fill="#38bdf8" fontSize="12" fontWeight="bold">
                b = {pythRes.b}
              </text>
              <text
                x={20 + (pythRes.a * 5) / 2 + 10}
                y={150 - (pythRes.b * 4) / 2}
                fill="#f43f5e"
                fontSize="12"
                fontWeight="bold"
              >
                c = {pythRes.c}
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* 4. CUSTOM AI MATH PROBLEM SOLVER */}
      {activeTool === 'custom' && (
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-r from-indigo-900/90 to-blue-900/90 text-white rounded-2xl shadow-md space-y-3">
            <h4 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Pecahkan Soal Matematika Bebas dengan AI
            </h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Ketikkan pertanyaan matematika apa saja (termasuk aljabar, kalkulus, deret, soal cerita) untuk mendapatkan pembahasan lengkap terstruktur.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                value={customProblem}
                onChange={(e) => setCustomProblem(e.target.value)}
                placeholder="Contoh: Hitung akar-akar dari 2x² - 8x + 6 = 0..."
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-indigo-200 focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={() => handleSolveCustomMath()}
                disabled={!customProblem.trim() || isAiLoading}
                className="px-5 py-2.5 bg-yellow-400 text-slate-900 font-extrabold rounded-xl text-xs hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? 'Memecahkan...' : 'Pecahkan Soal'}
              </button>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
              <span className="text-indigo-300 font-semibold whitespace-nowrap">Contoh Soal:</span>
              {[
                'Turunan dari f(x) = 4x³ - 6x² + 9x - 12',
                'Jumlah 12 suku pertama deret 5 + 10 + 15...',
                'Sebuah segitiga siku-siku memiliki alas 9 cm dan miring 15 cm. Berapa tingginya?',
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCustomProblem(p);
                    handleSolveCustomMath(p);
                  }}
                  className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white whitespace-nowrap border border-white/20 text-[11px]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* AI Solution Breakdown Render */}
          {isAiLoading && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium">Guru AI sedang menganalisis & menyusun langkah matematika...</p>
            </div>
          )}

          {aiError && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              ⚠️ {aiError}
            </div>
          )}

          {aiSolution && !isAiLoading && (
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Ringkasan Soal
                </span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">{aiSolution.problemSummary}</h5>
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  <strong>Diketahui:</strong>
                  {aiSolution.givenValues?.map((val, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-mono">{val}</span>
                  ))}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                  📐 Rumus Utama: <code className="font-mono bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">{aiSolution.formulaUsed}</code>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  Langkah-Langkah Penyelesaian Terstruktur:
                </h5>
                {aiSolution.steps?.map((st) => (
                  <div key={st.stepNumber} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {st.stepNumber}
                      </span>
                      <h6 className="text-xs font-bold text-slate-900 dark:text-white">{st.stepTitle}</h6>
                    </div>
                    <div className="font-mono text-xs bg-slate-100 dark:bg-slate-700/60 p-2 rounded-lg text-blue-700 dark:text-blue-300 font-bold">
                      {st.mathExpression}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {st.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Final Answer Banner */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 space-y-1">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">
                  ✅ Hasil Akhir
                </span>
                <p className="text-lg font-black font-mono">{aiSolution.finalAnswer}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  💡 <strong>Tips Cek Jawaban:</strong> {aiSolution.verificationTip}
                </p>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
