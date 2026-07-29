"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Volume2,
  ArrowLeftRight,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ShieldAlert,
  Flame,
  Info,
} from "lucide-react";

// DINO SPECIES & PRESETS
const DINO_SPECIES = [
  {
    id: "trex",
    name: "تی‌رکس (T-Rex)",
    icon: "🦖",
    tag: "خشن و قدرتمند",
    sound: "ROAARRR!",
  },
  {
    id: "raptor",
    name: "ولاسیرپتور (Velociraptor)",
    icon: "🐊",
    tag: "سریع و هوشمند",
    sound: "Sreeeech!",
  },
  {
    id: "brachio",
    name: "براکیوسور (Brachiosaurus)",
    icon: "🦕",
    tag: "آرام و بزرگ",
    sound: "Hooouuuum!",
  },
  {
    id: "tricera",
    name: "تری‌سراتوپس (Triceratops)",
    icon: "🦏",
    tag: "سرسخت و مدافع",
    sound: "Grunt-Grunt!",
  },
];

export default function DinoTranslatorPage() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"humanToDino" | "dinoToHuman">(
    "humanToDino",
  );
  const [selectedSpecies, setSelectedSpecies] = useState("trex");
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<
    { source: string; result: string; mode: string }[]
  >([]);

  // Sound effect simulation
  const handlePlaySound = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text || "Roar!");
      utterance.pitch = selectedSpecies === "brachio" ? 0.3 : 0.6;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          mode: mode,
          species: selectedSpecies,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setTranslatedText(data.result);
        setHistory((prev) => [
          { source: inputText, result: data.result, mode },
          ...prev.slice(0, 4),
        ]);
      } else {
        setTranslatedText(
          "غش کردیم! متأسفانه دایناسورها پیام رو متوجه نشدن. دوباره تلاش کن.",
        );
      }
    } catch (error) {
      console.error(error);
      setTranslatedText(
        "خطا در ارتباط با دنیای ژوراسیک! کلید API را بررسی کنید.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSwapMode = () => {
    setMode((prev) => (prev === "humanToDino" ? "dinoToHuman" : "humanToDino"));
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 font-sans dir-rtl flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950"
      dir="rtl"
    >
      {/* BACKGROUND GLOW DECORATIONS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
              🦖
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                مترجم ژوراسیک (DinoTalk)
              </h1>
              <p className="text-xs text-slate-400">
                ترجمه هوشمند به زبان دایناسورها با هوش مصنوعی Gemini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-6 md:py-10 flex-grow flex flex-col gap-6">
        {/* SPECIES SELECTION TABS */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="text-xs text-slate-400 mb-2 font-medium px-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            انتخاب گونه دایناسور:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DINO_SPECIES.map((species) => (
              <button
                key={species.id}
                onClick={() => setSelectedSpecies(species.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-right transition-all duration-200 ${
                  selectedSpecies === species.id
                    ? "bg-emerald-600/20 border-emerald-500/60 text-emerald-300 shadow-md border"
                    : "bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border"
                }`}
              >
                <span className="text-2xl">{species.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate">
                    {species.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {species.tag}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MODE SWITCHER & TRANSLATOR BOX */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-xl relative">
          {/* CONTROL BAR */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-200">
                {mode === "humanToDino"
                  ? "زبان انسان ➔ زبان دایناسور"
                  : "زبان دایناسور ➔ زبان انسان"}
              </span>
            </div>

            <button
              onClick={handleSwapMode}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-xl transition border border-slate-700/80 active:scale-95"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>تغییر جهت ترجمه</span>
            </button>
          </div>

          {/* TWO-COLUMN TRANSLATOR CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* INPUT CARD */}
            <div className="flex flex-col bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 focus-within:border-emerald-500/50 transition">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>
                  {mode === "humanToDino"
                    ? "متن ورودی (فارسی / انگلیسی)"
                    : "متن ورودی دایناسوری (غرش/ناله)"}
                </span>
                <span>{inputText.length} کاراکتر</span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === "humanToDino"
                    ? "سلام، امروز چه خبر؟ می‌خوای با هم شکار بریم؟"
                    : "ROAAR! Grrr... Raaaawr rawr GRRRR!"
                }
                className="w-full h-36 md:h-44 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-none text-base leading-relaxed"
              />

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                <button
                  onClick={() => setInputText("")}
                  className="text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  پاک کردن
                </button>
                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 transition active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال غرش...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>ترجمه کن</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* OUTPUT CARD */}
            <div className="flex flex-col bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  نتیجه ترجمه:
                </span>
                {translatedText && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePlaySound(translatedText)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
                      title="پخش صدا"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
                      title="کپی نتیجه"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full h-36 md:h-44 overflow-y-auto text-emerald-300 text-lg font-medium leading-relaxed dir-rtl whitespace-pre-wrap">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <div className="text-3xl animate-bounce">🦖</div>
                    <span className="text-xs">
                      در حال پردازش آواهای عصر ژوراسیک...
                    </span>
                  </div>
                ) : translatedText ? (
                  translatedText
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
                    ترجمه اینجا نمایش داده می‌شود...
                  </div>
                )}
              </div>

              {/* FOOTER BADGE */}
              <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-500 flex justify-between items-center">
                <span>
                  زبان خروجی:{" "}
                  {mode === "humanToDino" ? "دیپ دینو (Dino-A)" : "فارسی روان"}
                </span>
                <span>پاسخ‌دهی آنی</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT TRANSLATIONS HISTORY */}
        {history.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-400" />
              تاریخچه ترجمه‌های اخیر:
            </h3>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 text-xs flex justify-between items-center gap-4"
                >
                  <span className="text-slate-400 truncate max-w-[40%]">
                    {item.source}
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="text-emerald-400 font-medium truncate max-w-[40%]">
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          توسعه‌یافته با Next.js, Tailwind CSS و Gemini API | دپلوی‌شده روی
          Vercel
        </p>
      </footer>
    </div>
  );
}
