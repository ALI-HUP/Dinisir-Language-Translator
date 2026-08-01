import { NextResponse } from "next/server";
// @ts-ignore
import gTTS from "gtts";

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

    // ساخت استریم صوتی با زبان فارسی
    const gtts = new gTTS(cleanText, "fa");

    // تبدیل استریم به Buffer
    const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = gtts.stream();

      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", (err: any) => reject(err));
    });

    // 👈 تبدیل Buffer به Uint8Array برای رفع ارور تایپ‌اسکریپت
    const uint8Array = new Uint8Array(audioBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": uint8Array.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS Route Error:", error);
    return new NextResponse("خطای داخلی سرور در تولید صوت", { status: 500 });
  }
}