import { NextRequest, NextResponse } from "next/server";
import { AIDAN_CONTEXT } from "@/lib/aidan-context";

// Swap the model here if needed (e.g. gemini-2.0-flash).
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

type ChatMessage = { role: "user" | "model"; text: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: AIDAN_CONTEXT }] },
        contents: messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini error:", res.status, detail);
      return NextResponse.json(
        { error: "The model could not respond right now." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim() ?? "";

    return NextResponse.json({ reply: reply || "…" });
  } catch (err) {
    console.error("Chat route failed:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
