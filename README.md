# ⚡ PULSE_NET

> /// ALGORITHMIC TIME-DECAY FEED /// SYSTEM STATUS: NOMINAL ///

**[🟢 Live Link](https://pulse-net-y1p9.vercel.app/)**

**PULSE_NET** is a full-stack, real-time social networking platform architected around a dynamic time-decay heuristic and a highly stylized Web 1.0 / Neo-Brutalist user interface. 

Bypassing traditional chronological sorting, Pulse implements a mathematical algorithm that balances user engagement with temporal degradation—ensuring high-velocity, relevant content propagation while allowing stale data to naturally exit the network.

---

## 🚀 Core Architecture & Features

### 🧠 Heuristic Time-Decay Sorting
- Engineered a HackerNews-inspired ranking algorithm executed directly at the PostgreSQL database layer.
- **Formula:** `$Score = (Likes * 2.0) / (Hours Elapsed + 1)`
- Mathematically prioritizes high-engagement, volatile content over static historical data.

### ⚡ Full-Duplex Real-Time Synchronization
- Leverages STOMP over WebSockets via Spring `SimpMessagingTemplate` for low-latency, bi-directional data broadcasting.
- Enables instant state propagation of client interactions (likes, deletions, transmissions) across the network without HTTP polling.

### 🔐 Stateless Security Protocol
- Implements robust JWT (JSON Web Token) authentication.
- Features stateless authorization filters to secure and validate incoming requests to protected REST API endpoints.

### 🎨 Neo-Brutalist Design System
- Custom UI architecture built on Tailwind CSS v4.
- Enforces strict design constraints: high-contrast structural borders, raw terminal aesthetics, and fluid mobile-first responsiveness.

### 🔊 Auditory UX (Web Audio API)
- Integrates the browser's native Web Audio API to programmatically synthesize 8-bit auditory feedback.
- Maps specific frequencies and waveforms to application state changes (UI clicks, network errors, data transmissions).

### ♾️ Performant Data Hydration
- Implemented an `IntersectionObserver`-driven infinite scroll mechanism.
- Utilizes cursor-based pagination for bottomless, memory-efficient data fetching from the Spring backend.

---

## 💻 Tech Stack

### Frontend (Client)
- React 18 + TypeScript (Vite Build System)
- Tailwind CSS v4 (Custom Neo-Brutalist Theme)
- Lucide Icons (SVG rendering)
- Sonner (Optimized toast notifications)

### Backend (API)
- Java 21 + Spring Boot 3.x
- Spring Security (JWT Provider)
- Spring WebSockets (STOMP Protocol)
- Spring Data JPA / Hibernate ORM

### Database
- PostgreSQL (Fully normalized relational schema)

---

## 📂 Repository Structure

This is a monorepo setup containing decoupled frontend and backend architectures:

```text
PULSE_NET/
├── pulse/             # Spring Boot Backend API
└── pulse-ui/          # React + Vite Frontend
🛠️ Local Development Setup
1️⃣ Database Initialization
Ensure a local instance of PostgreSQL is running on port 5432.

SQL

CREATE DATABASE pulse_db;
2️⃣ Backend Execution
Open a terminal in the pulse/ directory and configure your application.properties with your local database credentials.

Bash

cd pulse
mvn clean install
mvn spring-boot:run
The API server will initialize on http://localhost:8080.

3️⃣ Frontend Execution
Open a new terminal session in the pulse-ui/ directory.

Bash

cd pulse-ui
npm install
npm run dev
The client application will initialize on http://localhost:5173.

📜 License
This project is licensed under the MIT License.
See the LICENSE file for details.

🧩 Architectural Philosophy
Pulse represents a departure from static engagement loops. It is a deterministic, system-driven platform where:

Visibility is mathematically earned through network interaction.

Content naturally degrades as temporal limits are reached.

The data stream remains in continuous motion.

👨‍💻 Built with intent, not templates.
