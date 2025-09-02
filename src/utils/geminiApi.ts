import axios from "axios";

export async function fetchGeminiReply(
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  try {
    // Convert chat history to Gemini format
    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: `
            You are a friendly restaurant assistant for Oceanview Bistro.
            Your job is to answer questions about our menu, hours, and make reservation bookings for users.
            For bookings, ask for the date, time, number of guests, and name. Confirm the reservation and provide a summary. If you need more info, ask follow-up questions. Be concise and polite.

            SAFETY RULES:
            - Do NOT share personal information, payment details, or request sensitive data.
            - Do NOT answer medical, legal, or financial questions.
            - If asked about topics unrelated to the restaurant, politely refuse and redirect to restaurant services.
            - Never make promises about discounts, offers, or policies not explicitly mentioned.
            - Always be respectful and professional.

            ACCURACY RULES:
            - Do NOT make up information, speculate, or add filler statements.
            - Only answer based on explicit information provided to you about the restaurant (menu, hours, reservation policy).
            - If you do not know the answer, simply say "I'm sorry, I don't have that information."
            - Do NOT invent menu items, hours, or policies.
            - Do NOT mention anything about the menu, hours, or policies unless you have been given that information.
            - Do NOT say anything about the menu being extensive, changing seasonally, or similar unless explicitly told.
          `,
        },
      ],
    };

    const contents = [
      systemPrompt,
      ...messages.map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: contents }),
    });

    const data = await res.json();
    return data.reply ?? "Sorry, I couldn't get a reply.";
  } catch (err) {
    return "Error: Could not reach Gemini API.";
  }
}
