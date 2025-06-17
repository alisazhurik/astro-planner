import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // переконайся, що він є у твоєму .env.local
});

export async function POST(req: Request) {
  try {
    const { zodiacSign, name, date, planetaryInfluence } = await req.json();

    const prompt = `
Generate a short, inspiring daily horoscope for ${zodiacSign} for ${name}, born under the sign of ${zodiacSign} (${planetaryInfluence} influence), for the date ${new Date(date).toDateString()}.
Include: day's energy summary, 1-2 focus areas, lucky color, and a one-line affirmation.
Tone: uplifting, empowering, modern.
Response in Markdown format.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 400,
    });

    const horoscope = completion.choices[0]?.message?.content ?? 'No horoscope today.';

    return NextResponse.json({ result: horoscope });
  } catch (error) {
    console.error('[Generate Horoscope Error]:', error);
    return NextResponse.json({ error: 'Failed to generate horoscope' }, { status: 500 });
  }
}
