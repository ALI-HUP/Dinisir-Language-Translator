import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return new NextResponse("متنی برای تبدیل صوتی ارسال نشده است.", { status: 400 });
    }

    // پاک‌سازی علائم نگارشی تکراری
    const cleanText = text.replace(/[!؟?.\s]+/g, " ").trim();

    if (!cleanText) {
      return new NextResponse("متن معتبر نیست.", { status: 400 });
    }

    // استفاده از اندپوینت استاندارد gTTS با انکودینگ انحصاری
    const encodedText = encodeURIComponent(cleanText);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=fa&total=1&idx=0&textlen=${cleanText.length}&client=tw-ob&prev=input`;

    const response = await fetch(ttsUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "fa,en-US;q=0.9,en;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Google TTS Blocked Error Status:", response.status);
      return new NextResponse("خطا در سرویس صوتی گوگل", { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS Route Exception:", error);
    return new NextResponse("خطای داخلی سرور", { status: 500 });
  }
}