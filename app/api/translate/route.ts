import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'کلید GEMINI_API_KEY تنظیم نشده است.' },
        { status: 500 }
      );
    }

    const { text, mode, species } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'متنی ارسال نشده است.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // System prompt styling based on mode and species
    let systemPrompt = '';
    if (mode === 'humanToDino') {
      systemPrompt = `You are a Dinosaur Translator AI specializing in the ${species} species. 
Translate the following Human text into hilarious, expressive, realistic dinosaur sounds and words (e.g., ROAR, GRRR, SCREECH, rawr, snarl). 
Add short funny English/Persian translations in parentheses if appropriate, but keep the primary dinosaur roar language dominant and funny!`;
    } else {
      systemPrompt = `You are a Jurassic Linguist AI. Translate the given dinosaur roars, grunts, or screech sounds into funny, witty Persian sentences as if explaining what the dinosaur is trying to say to a human.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nInput Text: "${text}"`,
    });

    const result = response.text || 'ROAARRRR! (ترجمه ناموفق بود)';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'خطایی در پردازش هوش مصنوعی رخ داد.' },
      { status: 500 }
    );
  }
}