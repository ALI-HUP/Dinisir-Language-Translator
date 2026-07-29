"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Info,
  Lightbulb,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import StarBurst from "@/components/StarBurst";

const SUGGESTED_TEXTS = [
  "سلام چطوری خوبی؟ چه خبر؟",
  "سلام رئیس، پروژه تموم شده و آماده تحویله!",
  "دلم برات تنگ شده بود، کی میای همدیگه رو ببینیم؟",
  "من عقده‌ام کثافت؟؟؟",
  "امروز رفتم مغازه خرید کنم، فروشنده گفت جنسا گرون شده!",
  "خواهیم دید چه خواهد شد!!",
  "جات خالی رفتیم شمال، هوا عالی بود و کلی خوش گذشت.",
  "بخشش لازم نیست، اعدامش کنید!",
  "اون ممه رو لولو برد...",
];

const ENGLISH_WARNINGS = [
  "دیگه چی؟ میخوای برات انگلیسی هم ترجمه کنم؟ فارسی بنویس بینیم بابا!",
  "یعنی مثلا خیلی خفنی انگلیسی مینویسی؟ فارسی بنویس ما هم بفهمیم چی میگی متمدن!",
  "اون موقع که ما زبونمونو ساختیم انگلیسی نبود... بیا پایین قوربه سگ!",
  "جون بابا اینگیلیش! فارسی بنال...",
  "هه، سیشتیر!! فارسی پلیز لطفا...",
];

export default function DinoTranslatorPage() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<{ source: string; result: string }[]>(
    [],
  );

  const [loadingStep, setLoadingStep] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev === 0 ? 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const hasEnglish = /[a-zA-Z]/.test(text);

    if (hasEnglish) {
      const randomWarning =
        ENGLISH_WARNINGS[Math.floor(Math.random() * ENGLISH_WARNINGS.length)];
      setWarningMessage(randomWarning);
      return;
    }

    setInputText(text);
  };

  const handleCloseModal = () => {
    setWarningMessage(null);
    setInputText("");
    setTranslatedText("");
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate || inputText;
    if (!text.trim()) return;

    if (/[a-zA-Z]/.test(text)) {
      const randomWarning =
        ENGLISH_WARNINGS[Math.floor(Math.random() * ENGLISH_WARNINGS.length)];
      setWarningMessage(randomWarning);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          mode: "humanToDino",
        }),
      });

      const data = await response.json();
      if (data.result) {
        setTranslatedText(data.result);
        setHistory((prev) => [
          { source: text, result: data.result },
          ...prev.slice(0, 4),
        ]);
      } else {
        setTranslatedText("خطا در ترجمه! دوباره تلاش کن.");
      }
    } catch (error) {
      console.error(error);
      setTranslatedText("خطا در ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggested = (text: string) => {
    setInputText(text);
    handleTranslate(text);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-slate-900 text-white font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden"
      dir="rtl"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <StarBurst
          color="#22d3ee"
          starCount={2000}
          speed={10}
          opacity={40}
          centerX={50}
          centerY={30}
        />
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative z-10 border-b border-blue-500/30 bg-slate-800/90 backdrop-blur-md px-4 py-3 md:py-4 md:px-8 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-blue-900/40 border border-cyan-300/40 hover:rotate-12 transition-transform duration-300">
              🦖
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-black tracking-tight bg-linear-to-r from-white via-sky-200 to-cyan-300 bg-clip-text text-transparent truncate">
                مترجم دینیسیر
              </h1>
              <p className="text-xs md:text-sm text-cyan-100/90 font-medium leading-tight">
                تبدیل هوشمند زبان آدمیزاد به دایناسور بدون فک 🦖
              </p>
            </div>
          </div>

          <div className="self-end sm:self-auto flex items-center gap-2 bg-blue-900/60 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full border border-cyan-400/40 text-[11px] md:text-xs font-semibold text-cyan-200 shrink-0 shadow-sm">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-cyan-300 animate-pulse"></span>
            <span>Gemini Powered</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 py-6 md:py-8 grow flex flex-col gap-6">
        <div className="bg-slate-800/70 border border-sky-500/30 rounded-3xl p-5 md:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-sky-500/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col bg-slate-900/80 border border-blue-700/50 rounded-2xl p-5 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/30 transition-all duration-300">
              <div className="flex items-center justify-between text-sm text-cyan-200 mb-3 font-bold">
                <span>متن آدمیزادی بینیویس</span>
                <span className="bg-blue-900/80 text-cyan-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-cyan-400/40 transition-transform active:scale-95">
                  {inputText.length} کاراکتر
                </span>
              </div>

              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="متنت رو اینجا بنویس تا به دینیسیری تبدیلش کنیم..."
                className="w-full h-40 md:h-48 bg-transparent text-white placeholder-slate-400 focus:outline-none resize-none text-lg md:text-xl leading-relaxed font-medium"
              />

              <div className="flex justify-between items-center pt-3 border-t border-blue-800/60 mt-auto">
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText("");
                      setTranslatedText("");
                    }}
                    className="text-sm text-slate-300 hover:text-rose-400 transition flex items-center gap-1 font-semibold cursor-pointer active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>پاک کردن</span>
                  </button>
                )}
                <button
                  onClick={() => handleTranslate()}
                  disabled={isLoading || !inputText.trim()}
                  className={`mr-auto flex items-center gap-1.5 md:gap-2 bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 disabled:opacity-40 text-slate-950 font-black px-4 py-2.5 md:px-6 md:py-3 rounded-xl shadow-lg shadow-blue-900/50 transition duration-300 active:scale-95 text-sm md:text-base cursor-pointer ${
                    inputText.trim() && !isLoading ? "animate-pulse" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                      <span>در حال تبدیل...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                      <span>ترجمه کن</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col bg-slate-900/80 border border-blue-700/50 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-bold text-cyan-300 text-base">
                  خروجی دینیسیری
                </span>
                {translatedText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 bg-blue-900/80 hover:bg-blue-800 text-white px-3 py-1.5 rounded-xl transition text-xs font-bold border border-cyan-400/40 cursor-pointer active:scale-90"
                    title="کپی متن"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-cyan-300 animate-bounce" />
                        <span className="text-cyan-300">کپی شد! خب بعدش؟</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>کپی</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="w-full h-40 md:h-48 overflow-y-auto text-cyan-200 text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-wrap">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-cyan-200 gap-3 transition-all duration-300">
                    <div className="text-4xl animate-bounce">🦖</div>
                    <span className="text-sm font-semibold animate-pulse">
                      {loadingStep === 0
                        ? "در حال پردازش آواهای عصر ژوراسیک..."
                        : "در حال تبدیل به زبان دینیسیری..."}
                    </span>
                  </div>
                ) : translatedText ? (
                  <span className="inline-block animate-fade-in">
                    {translatedText}
                  </span>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-base italic font-normal">
                    نتیجه ترجمه اینجا نشون داده میشه...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/70 p-5 rounded-2xl border border-sky-500/30 backdrop-blur-sm shadow-md">
          <div className="text-sm text-cyan-300 mb-3 font-bold flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-300 animate-pulse" />
            متن‌های پیشنهادی (برای تست کلیک کن)
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SUGGESTED_TEXTS.map((text, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggested(text)}
                className="text-sm bg-slate-900/90 hover:bg-blue-600/80 hover:border-cyan-300 hover:text-white hover:-translate-y-0.5 text-slate-100 px-4 py-2.5 rounded-xl border border-blue-700/50 transition duration-200 font-semibold active:scale-95 text-right cursor-pointer shadow-sm"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-slate-800/60 border border-sky-500/30 rounded-2xl p-5 shadow-sm transition-all duration-300">
            <h3 className="text-sm font-bold text-cyan-200 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-300" />
              تاریخچه ترجمه‌های اخیر:
            </h3>
            <div className="space-y-2.5">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 p-3 rounded-xl border border-blue-700/50 text-sm md:text-base flex justify-between items-center gap-4 hover:border-cyan-500/40 transition duration-200"
                >
                  <span className="text-white truncate max-w-[45%] font-medium">
                    {item.source}
                  </span>
                  <span className="text-cyan-400 font-black animate-pulse">
                    ➔
                  </span>
                  <span className="text-cyan-200 font-bold truncate max-w-[45%]">
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {warningMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-800 border-2 border-rose-500/60 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-5 transition-transform duration-300 scale-100 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl shadow-lg animate-bounce">
              🦖
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-lg">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span>انگلیسی تایپ کردی؟</span>
              </div>
              <p className="text-white text-base md:text-lg font-bold leading-relaxed pt-2">
                {warningMessage}
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full bg-linear-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 hover:shadow-rose-500/20 hover:shadow-xl text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg transition duration-200 active:scale-95 text-sm md:text-base cursor-pointer"
            >
              بنده متوجه اشتباهم شده و عذرخواهم
            </button>
          </div>
        </div>
      )}

      <footer className="relative z-10 border-t border-blue-500/30 bg-slate-900/90 py-4 text-center text-xs text-cyan-200/70 font-medium">
        <p>طراحی‌شده با Next.js & Tailwind CSS | دپلوی روی Vercel</p>
      </footer>
    </div>
  );
}
