# ⚡ PULSE_NET

> /// ALGORITHMIC TIME-DECAY FEED /// SYSTEM STATUS: STABLE ///

**PULSE_NET** is a full-stack, real-time social networking platform
built around a dynamic time-decay algorithm and a bold Web 1.0 /
Neo-Brutalist interface.

Instead of a boring chronological feed, Pulse intelligently ranks
content by balancing engagement with recency --- keeping the network
fast, relevant, and alive.

------------------------------------------------------------------------

## 🚀 Core Features

### 🧠 Algorithmic Feed

-   HackerNews-inspired ranking system powered by PostgreSQL\
-   Score formula: Score = (Likes × 2.0) / (Hours Elapsed + 1)
-   Prioritizes high-engagement, recent content

### ⚡ Real-Time Interactions

-   WebSocket-powered updates using Spring SimpMessagingTemplate
-   Instant propagation of likes and activity (no refresh needed)

### 🔐 Stateless Authentication

-   JWT-based authentication
-   Secure, protected API routes

### 🎨 Neo-Brutalist UI

-   Tailwind CSS v4 with custom brutalist styling
-   Sharp contrasts, heavy borders, raw terminal aesthetics

### 🔊 Sensory Feedback

-   Web Audio API integration
-   8-bit UI sounds for actions (clicks, errors, transmissions)

### ♾️ Infinite Scroll

-   Cursor-based pagination
-   Implemented via IntersectionObserver for seamless data loading

------------------------------------------------------------------------

## 💻 Tech Stack

### Frontend (Client)

-   React (TypeScript) + Vite\
-   Tailwind CSS v4 (custom Neo-Brutalist theme)\
-   Lucide Icons\
-   Sonner (toast notifications)

### Backend (API)

-   Java 21 + Spring Boot 3.x\
-   Spring Security (JWT)\
-   Spring WebSockets\
-   Spring Data JPA / Hibernate

### Database

-   PostgreSQL (fully normalized schema)

------------------------------------------------------------------------

## 📂 Repository Structure

Monorepo setup containing both frontend and backend:

PULSE_NET/ ├── pulse/ \# Spring Boot Backend API └── pulse-ui/ \#
React + Vite Frontend

------------------------------------------------------------------------

## 🛠️ Local Setup & Installation

### 1️⃣ Database Setup

-   Ensure PostgreSQL is running on port 5432
-   Create a database: CREATE DATABASE pulse_db;

------------------------------------------------------------------------

### 2️⃣ Backend Setup

cd pulse

-   Configure application.properties with your database credentials

mvn clean install mvn spring-boot:run

Backend runs on: http://localhost:8080

------------------------------------------------------------------------

### 3️⃣ Frontend Setup

cd pulse-ui npm install npm run dev

Frontend runs on: http://localhost:5173

------------------------------------------------------------------------

## 📜 License

This project is licensed under the MIT License.\
See the LICENSE file for details.

------------------------------------------------------------------------

## 🧩 Philosophy

Pulse isn't trying to be another "engagement trap" social app.

It's a system-driven platform where: - visibility is earned through
interaction - content naturally decays over time - and the feed stays in
motion --- always

------------------------------------------------------------------------

## 👨‍💻 Author

Built with intent, not templates.
