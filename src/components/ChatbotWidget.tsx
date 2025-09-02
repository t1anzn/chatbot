import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { fetchGeminiReply } from "../utils/geminiApi";

type Role = "user" | "model";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatbotWidgetProps {
  title?: string;
  position?: "bottom-right" | "bottom-left";
  className?: string;
}

export default function ChatbotWidget({
  title = "Chatbot",
  position = "bottom-right",
  className,
}: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isReplying]);

  console.log("Chat panel open:", open);

  // Pick position classes based on prop
  const positionClass =
    position === "bottom-right"
      ? "fixed bottom-4 right-4"
      : "fixed bottom-4 left-4";

  return (
    <div
      className={`${positionClass} z-[1000] font-sans ${className ?? ""} ${
        !open ? "hover:bottom-6 duration-500" : ""
      }`}
    >
      {/* Launcher Button */}
      {!open && (
        <button
          type="button"
          aria-label={`Open ${title}`}
          className={`w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg duration-500
                inline-flex items-center justify-center
                ${open ? "hidden" : ""}`}
          onClick={() => setOpen(true)}
        >
          {/* Simple chat icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 5V5Z"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      <div
        className={[
          open ? "flex flex-col z-[1000]" : "hidden",
          "w-[360px] max-w-[90vw] h-[520px] max-h-[70vh] min-h-0",
          "bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b border-slate-200 bg-slate-50/60">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
            AI
          </div>
          <div className="flex-1 leading-tight">
            <div className="font-semibold text-slate-800">{title}</div>
            <div className="text-xs text-slate-500">Online</div>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-slate-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Message list (scrollable area) */}
          <div
            className="flex-1 min-h-0 bg-slate-50 p-3 overflow-y-auto"
            ref={listRef}
          >
            {messages.length === 0 ? (
              <div className="pl-2 pt-2 text-slate-400 text-sm">
                Let's chat!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isReplying && (
              <div
                className="mb-2 flex justify-start"
                role="status"
                aria-live="polite"
              >
                <div className="px-3 py-3 bg-slate-200 rounded-lg">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Input bar */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!input.trim() || isReplying) return;
                const userText = input;
                const newMessage: Message = {
                  id: Math.random().toString(36).slice(2),
                  role: "user",
                  content: input,
                  timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, newMessage]);
                setInput("");
                setIsReplying(true);

                const aiText = await fetchGeminiReply([
                  ...messages,
                  newMessage,
                ]);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Math.random().toString(36).slice(2),
                    role: "model",
                    content: aiText,
                    timestamp: Date.now(),
                  },
                ]);
                setIsReplying(false);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isReplying}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                disabled={!input.trim() || isReplying}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

