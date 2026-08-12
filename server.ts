import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK lazily/safely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Belajar Pintar API" });
});

// 1. AI Chat Route
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { subjectName, level, messages, topic } = req.body;
    
    if (!subjectName || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required parameters: subjectName and messages array." });
    }

    const ai = getGenAI();

    const levelGuide = `Target Siswa: SMP/MTs (Sekolah Menengah Pertama / Madrasah Tsanawiyah, ${level || 'Kelas 7-9'}). Gunakan gaya bahasa yang bersahabat, terstruktur, mudah dipahami remaja, dengan contoh aplikasi sehari-hari yang menarik dan relevan untuk tingkat ${level || 'SMP/MTs'}.`;

    const systemInstruction = `Kamu adalah Guru Ahli AI yang ramah, sabar, dan inspiratif untuk mata pelajaran "${subjectName}" tingkat ${level || 'SMP/MTs'}.
Pedoman Pembelajaran Spesifik Jenjang (${level || 'SMP/MTs'}):
${levelGuide}

Aturan Utama Pembelajaran:
1. Jelaskan materi secara bertahap (step-by-step).
2. Sesuaikan tingkat kesulitan dan kompleksitas bahasa secara ketat dengan jenjang ${level || 'SMP/MTs'}.
3. Berikan CONTOH NYATA dalam kehidupan sehari-hari pada setiap penjelasan.
4. Bila siswa bertanya tentang tugas/PR/soal, BANTU memahami konsepnya secara bertahap dan JANGAN langsung memberi jawaban instan tanpa penjelasan.
5. Gunakan format Markdown yang rapi (bold, bullet points, blok rumus/persamaan bila perlu) agar sangat nyaman dibaca.
${topic ? `Topik pembelajaran saat ini: "${topic}".` : ''}`;

    // Map message history to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Maaf, saya tidak dapat memproses jawaban saat ini. Silakan coba lagi.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.status(500).json({
      error: error.message || "Gagal menghubungi AI Belajar Pintar. Pastikan API key sudah dikonfigurasi.",
    });
  }
});

// 2. AI Topic Explanation Route
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { subjectName, level, topic } = req.body;
    
    if (!subjectName || !topic) {
      return res.status(400).json({ error: "Missing required parameters: subjectName and topic." });
    }

    const ai = getGenAI();

    const prompt = `Jelaskan secara lengkap namun sederhana topik "${topic}" untuk mata pelajaran "${subjectName}" tingkat ${level || 'SMP/MTs'}.

Sertakan bagian berikut dengan format Markdown:
# 🎯 Konsep Utama
(Penjelasan singkat inti topik dalam 2-3 kalimat)

## 📌 Penjelasan Langkah demi Langkah
(Langkah 1, 2, 3 penjelasan terstruktur)

## 💡 Contoh dalam Kehidupan Nyata
(2 contoh konkret yang relevan bagi siswa)

## ✍️ Contoh Soal & Pembahasan Singkat
(1 contoh soal sederhana dan cara penyelesaiannya)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/explain:", error);
    return res.status(500).json({ error: error.message || "Gagal membuat penjelasan materi." });
  }
});

// 3. AI Practice Questions Route (Latihan Soal)
app.post("/api/ai/practice", async (req, res) => {
  try {
    const { subjectName, level, difficulty, count } = req.body;
    const ai = getGenAI();

    const diff = difficulty || 'Sedang';
    const num = count || 3;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Buatkan ${num} latihan soal mata pelajaran ${subjectName} tingkat ${level || 'SMP/MTs'} dengan tingkat kesulitan "${diff}". 
Berikan dalam format JSON terstruktur.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING, description: "Judul/Topik Soal" },
              difficulty: { type: Type.STRING, description: "Tingkat Kesulitan" },
              problem: { type: Type.STRING, description: "Teks soal" },
              hint: { type: Type.STRING, description: "Petunjuk/Clue penyelesaian" },
              solution: { type: Type.STRING, description: "Pembahasan lengkap langkah demi langkah" },
            },
            required: ["id", "title", "difficulty", "problem", "hint", "solution"],
          },
        },
      },
    });

    let questions = [];
    try {
      questions = JSON.parse(response.text || "[]");
    } catch {
      questions = [];
    }

    return res.json({ questions });
  } catch (error: any) {
    console.error("Error in /api/ai/practice:", error);
    return res.status(500).json({ error: error.message || "Gagal memuat latihan soal." });
  }
});

// 4. AI Interactive Quiz Route
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { subjectName, level, topic } = req.body;
    const ai = getGenAI();

    const topicText = topic ? `topik "${topic}"` : "materi umum";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Buatkan 5 kuis pilihan ganda interaktif untuk mata pelajaran ${subjectName} tingkat ${level || 'SMP/MTs'} (${topicText}).
Setiap soal harus memiliki 4 pilihan jawaban (A, B, C, D), nomor indeks jawaban benar (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D), dan pembahasan singkat.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING, description: "Pertanyaan kuis" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array 4 pilihan jawaban"
              },
              correctIndex: { type: Type.INTEGER, description: "Indeks jawaban yang benar (0-3)" },
              explanation: { type: Type.STRING, description: "Penjelasan mengapa jawaban tersebut benar" }
            },
            required: ["id", "question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    let quiz = [];
    try {
      quiz = JSON.parse(response.text || "[]");
    } catch {
      quiz = [];
    }

    return res.json({ quiz });
  } catch (error: any) {
    console.error("Error in /api/ai/quiz:", error);
    return res.status(500).json({ error: error.message || "Gagal membuat kuis." });
  }
});

// 5. AI Summary Route (Rangkum Materi)
app.post("/api/ai/summary", async (req, res) => {
  try {
    const { subjectName, level, topic } = req.body;
    const ai = getGenAI();

    const topicText = topic ? `topik "${topic}"` : "keseluruhan pokok bahasan";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Rangkum materi ${subjectName} tingkat ${level || 'SMP/MTs'} untuk ${topicText} secara terstruktur dan ringkas.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            summaryText: { type: Type.STRING, description: "Rangkuman singkat 2-3 paragraf" },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Poin-poin penting yang wajib dihafal/dipahami"
            },
            formulasOrConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Rumus, kata kunci, atau istilah penting"
            },
            quickTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Trik cepat/cara mudah mengingat"
            }
          },
          required: ["topic", "summaryText", "keyPoints", "formulasOrConcepts", "quickTips"]
        }
      }
    });

    let summary = null;
    try {
      summary = JSON.parse(response.text || "{}");
    } catch {
      summary = null;
    }

    return res.json({ summary });
  } catch (error: any) {
    console.error("Error in /api/ai/summary:", error);
    return res.status(500).json({ error: error.message || "Gagal membuat rangkuman." });
  }
});

// 6. AI Study Tips Route
app.post("/api/ai/tips", async (req, res) => {
  try {
    const { subjectName, level } = req.body;
    const ai = getGenAI();

    const prompt = `Berikan 5 tips belajar paling efektif khusus untuk menguasai mata pelajaran "${subjectName}" bagi siswa tingkat ${level || 'SMP/MTs'}. Format dalam Markdown yang menarik dan menyemangati.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return res.json({ tips: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/tips:", error);
    return res.status(500).json({ error: error.message || "Gagal mengambil tips belajar." });
  }
});

// 7. AI Step-by-Step Math Problem Solver
app.post("/api/ai/math-solve", async (req, res) => {
  try {
    const { mathProblem, level } = req.body;
    if (!mathProblem || typeof mathProblem !== 'string') {
      return res.status(400).json({ error: "Permintaan tidak valid: mathProblem wajib diisi." });
    }

    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Pecahkan soal matematika berikut secara terstruktur langkah demi langkah untuk jenjang ${level || 'SMP/MTs'}:
Soal: "${mathProblem}"

Sediakan jawaban dalam format JSON terstruktur dengan kunci:
- problemSummary: Ringkasan singkat soal
- givenValues: Array string nilai yang diketahui dalam soal (misal: ["a = 2", "b = -4"])
- formulaUsed: Rumus utama yang digunakan (misal: "x = (-b ± √(b² - 4ac)) / (2a)")
- steps: Array dari objek { stepNumber: number, stepTitle: string, mathExpression: string, explanation: string }
- finalAnswer: Hasil akhir yang jelas disertai satuan jika ada
- verificationTip: Cara memeriksa ulang kebenaran jawaban`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemSummary: { type: Type.STRING },
            givenValues: { type: Type.ARRAY, items: { type: Type.STRING } },
            formulaUsed: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  stepTitle: { type: Type.STRING },
                  mathExpression: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["stepNumber", "stepTitle", "mathExpression", "explanation"]
              }
            },
            finalAnswer: { type: Type.STRING },
            verificationTip: { type: Type.STRING }
          },
          required: ["problemSummary", "givenValues", "formulaUsed", "steps", "finalAnswer", "verificationTip"]
        }
      }
    });

    let solution = null;
    try {
      solution = JSON.parse(response.text || "{}");
    } catch {
      solution = null;
    }

    return res.json({ solution });
  } catch (error: any) {
    console.error("Error in /api/ai/math-solve:", error);
    return res.status(500).json({ error: error.message || "Gagal memecahkan soal matematika secara bertahap." });
  }
});

// 8. AI Science Experiment Analysis
app.post("/api/ai/science-analysis", async (req, res) => {
  try {
    const { labType, variables, observationNote, level } = req.body;
    const ai = getGenAI();

    const prompt = `Analisis eksperimen sains simulasi virtual berikut untuk siswa jenjang ${level || 'SMP/MTs'}:
Eksperimen: ${labType}
Variabel & Parameter: ${JSON.stringify(variables)}
Catatan Hasil Pengamatan: ${observationNote || 'Pengamatan simulasi'}

Berikan penjelasan ilmiah dalam format JSON terstruktur:
- conceptName: Nama fenomena/hukum alam yang diuji
- keyScientificLaw: Hukum sains/persamaan dasar (misal: "Hukum Ohm V = I × R" atau "Siklus Fotosintesis")
- analysisSummary: Penjelasan mengapa hasil eksperimen terjadi demikian
- observationTakeaways: Array string 3 poin pelajaran utama dari eksperimen
- followUpQuestions: Array string 2 pertanyaan refleksi kritis untuk siswa`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptName: { type: Type.STRING },
            keyScientificLaw: { type: Type.STRING },
            analysisSummary: { type: Type.STRING },
            observationTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["conceptName", "keyScientificLaw", "analysisSummary", "observationTakeaways", "followUpQuestions"]
        }
      }
    });

    let analysis = null;
    try {
      analysis = JSON.parse(response.text || "{}");
    } catch {
      analysis = null;
    }

    return res.json({ analysis });
  } catch (error: any) {
    console.error("Error in /api/ai/science-analysis:", error);
    return res.status(500).json({ error: error.message || "Gagal menganalisis hasil eksperimen sains." });
  }
});

// Start Express + Vite Middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server Belajar Pintar berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
