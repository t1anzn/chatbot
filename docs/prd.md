# 📄 Product Requirements Document (PRD)

**Product Name:** Restaurant Reservation Chatbot Widget  
**Author:** Tim  
**Date:** Aug 28, 2025  
**Version:** 0.1 (Draft)

---

## 1. Overview

The Restaurant Reservation Chatbot Widget is a conversational web widget designed for restaurants to handle table bookings directly on their websites. It uses a Large Language Model (LLM) to enable natural language interactions (e.g., “I’d like a table for 2 at 7pm tomorrow”) and logs structured reservation data into Google Sheets for restaurant staff.

---

## 2. Goals & Objectives

- Automate reservations: Reduce manual phone/email bookings.
- Improve UX: Allow customers to book tables naturally, not through rigid forms.
- Centralize data: Store reservations in Google Sheets (lightweight, easy for staff).
- Scalability: Create a reusable widget template that could be extended to other small businesses.

---

## 3. Key Features

### Customer-Facing (Frontend)
1. Chat widget UI
   - Floating button on restaurant’s site.
   - Opens chat window with conversation history.
   - Supports text input (future: voice).
2. Natural conversation flow (LLM-powered)
   - Greets users and asks if they want to book.
   - Extracts details from free-form inputs:
     - Name
     - Date & time
     - Party size
     - Contact number
   - Clarifies missing info automatically.
3. Reservation confirmation
   - Summarizes reservation before logging.
   - Confirms details with user.
   - Displays success message.

### Staff-Facing (Backend / Data)
1. Google Sheets integration
   - Appends new reservations to designated sheet.
   - Data fields: Timestamp, Name, Party Size, Date, Time, Phone.
2. Admin configuration (MVP optional)
   - Restaurant owner can edit business name, confirmation message, opening hours.
   - (Future stretch: dashboard UI).

---

## 4. Non-Goals (for MVP)

- No multi-language support (only English for MVP).
- No AI-powered availability checking (staff handle conflicts).
- No direct SMS/email confirmation to customers (phase 2).
- No payment processing.

---

## 5. Technical Requirements

**Frontend**
- Framework: React widget (embeddable with `<script>` snippet).
- UI: Chat bubbles, input box, scrollable chat history.
- Hosting: Vercel or Netlify (for demo).

**Backend**
- Framework: Node.js with Express.
- LLM API: OpenAI GPT-4o-mini (cheap, good at structured parsing).
- Data storage: Google Sheets API (service account authentication).
- Hosting: Vercel Serverless Functions, Render, or Railway.

---

## 6. LLM Prompting

System prompt:

```text
You are a restaurant reservation assistant. Collect reservation details: name, date, time, party size, phone. If information is missing, ask politely. When all details are ready, return them in JSON format along with a friendly confirmation message.
```

---

## 7. User Stories

**Customer**
- As a diner, I want to type “I need a table for 2 tomorrow at 7pm” so that the bot books me without multiple form fields.
- As a diner, I want to confirm my booking details before submission so I feel confident the restaurant received it.

**Restaurant Staff**
- As a restaurant owner, I want all reservations logged in Google Sheets so I can see them easily.
- As a restaurant owner, I want the chatbot to always confirm booking details so I don’t get incomplete reservations.

---

## 8. Success Metrics

- Primary: % of completed bookings via chatbot (vs abandoned).
- Secondary: Reduction in phone/email bookings.
- Tertiary: Positive customer feedback (“easy to book”).

---

## 9. Risks & Mitigations

- LLM misinterprets inputs → Add validation layer (e.g., regex for phone, date parsing).
- Google Sheets API limits → Caching/local logging fallback.
- Businesses lack tech skills → Provide one-line script embed + default Sheet template.

---

## 10. Future Enhancements

- Multi-language support.
- Email/SMS confirmations.
- Staff-facing dashboard (availability, cancellations).
- Multi-restaurant support (agency model).
- Integrations: POS, calendar sync.