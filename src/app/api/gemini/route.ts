import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const { messages } = await req.json();
  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  try {
    const response = await axios.post(`${endpoint}?key=${apiKey}`, {
      contents: messages,
    });
    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Gemini API error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: "Gemini API request failed" },
      { status: 500 }
    );
  }
}
