import React, { useEffect, useMemo, useRef, useState } from "react"

type Role = "user" | "assistant"

export interface Message { 
    id: string
    role: Role
    content: string 
    timestamp: number
}

export interface ChatbotWidgetProps { 
    title?: string
    position?: "bottom-right" | "bottom-left"
    className?: string
}

export default function ChatbotWidget({
    title = "Chatbot", 
    position = "bottom-right",
    className,
}: ChatbotWidgetProps) {
    const [open, setOpen] = useState(false)

    console.log("Chat panel open:", open)

    // Pick position classes based on prop
    const positionClass = 
    position === "bottom-right"
        ? "fixed bottom-4 right-4" 
        : "fixed bottom-4 left-4"
    
    return (
        <div className={`${positionClass} z-[1000] font-sans ${className ?? ""} ${!open ? "hover:bottom-6 duration-500" : ""}`}>
            {/* Launcher Button */}
            {!open && ( <button
                type = "button"
                aria-label={`Open ${title}`}
                className={`w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg duration-500
                inline-flex items-center justify-center
                ${open ? "hidden" : ""}`}
                onClick={() => setOpen(true)}
            >
                {/* Simple chat icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 5V5Z" stroke="white" strokeWidth="2" />
                </svg>
            </button>
            )}

            {/* Chat panel */}
            <div className={[
                open ? "flex z-[1000]" : "hidden",
                "flex-col w-[360px] max-w-[90vw] h-[520px] max-h-[70vh]",
                "bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
            ].join(" ")}
            >

                {/* Header */}
                <div className="flex items-center gap-3 p-3 border-b border-slate-200 bg-slate-50/60">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">AI</div>
                    <div className="flex-1 leading-tight">
                        <div className="font-semibold text-slate-800">{title}</div>
                        <div className="text-xs text-slate-500">Online</div>
                    </div>
                    <button
                        type="button"
                        aria-label="Close chat"
                        onClick={() => setOpen(false)}
                        className= "p-1 rounded-md hover:bg-slate-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >

                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M6 6l12 12M18 6L6 18"    
                            stroke="#334155"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    </button>
                    
                </div>
                {/* Body placeholder */}
                <div className="flex-1 bg-slate-50 p-3 text-slate-500 text-sm">
                    Chat content will appear here.
                </div>

            </div>
        </div>
    )
}