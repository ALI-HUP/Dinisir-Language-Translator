import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("TTS Error: GEMINI_API_KEY is not defined");
      return NextResponse.json(
        { error: "کلید GEMINI_API_KEY تنظیم نشده است." },
        { status: 500 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const text = body?.text;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "متن ورودی معتبر نیست یا خالی است." },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // درخواست تولید صوت فارسی با مدل مالتی‌مدال Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `لطفاً متن زیر را دقیقاً، با لحن طبیعی و به زبان فارسی بخوان:
"${text.trim()}"`,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Puck",
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts;
    const audioPart = parts?.find(
      (p: any) => p.inlineData && p.inlineData.data,
    );

    if (!audioPart || !audioPart.inlineData?.data) {
      console.error(
        "TTS Error: Audio data missing in Gemini response",
        JSON.stringify(response),
      );
      return NextResponse.json(
        { error: "داده صوتی از هوش مصنوعی دریافت نشد." },
        { status: 500 },
      );
    }

    const base64Data = audioPart.inlineData.data;
    const mimeType = audioPart.inlineData.mimeType || "audio/mp3";
    const audioBuffer = Buffer.from(base64Data, "base64");

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Gemini Audio Generation Error:", error?.message || error);
    return NextResponse.json(
      { error: "خطا در پردازش فایل صوتی." },
      { status: 500 },
    );
  }
}
