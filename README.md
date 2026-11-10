# Aether AI — Autonomous Software Engineer Agent

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Groq Cloud](https://img.shields.io/badge/Groq-LPU_Accelerated-f55036?logo=fastapi&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An autonomous, full-stack AI software engineering workspace designed for building, refactoring, debugging, and deploying production code. Inspired by the sleek developer aesthetics of **Cursor AI, Linear, Vercel Dashboard, and GitHub Dark**.

---

## ✨ Features

- **⚡ Autonomous AI Execution Workspace**
  - Multi-mode engineering assistance: *Code Generator*, *Senior Assistant*, *Root-Cause Debugger*, and *DevOps & Cloud Deployment*.
  - Step-by-step execution timeline with real-time pipeline status and duration metrics.
  - Prism-powered syntax highlighting with line numbers, code copy, and file language detection.
  - Multi-tab solution viewer (*Rendered Markdown*, *Extracted Code Artifacts*, *Raw Output*).

- **💻 IDE-Style Code Explorer**
  - Dual-panel layout featuring a workspace file tree and code editor view.
  - Automatic ingestion of code artifacts generated during AI sessions.
  - One-click file downloading and clipboard copying.

- **📁 Project Workspaces**
  - Multi-project management with tech stack chips and status indicators (*Active*, *Building*, *Idle*).
  - Search and filter projects by stack or name.
  - Create new projects via an integrated modal dialog.

- **📜 Execution History & Telemetry**
  - Searchable task history with status filtering (*All*, *Completed*, *Running*, *Failed*).
  - Execution duration benchmarks and one-click rerun capabilities.
  - Raw stdout event telemetry stream with export to `.txt`.

- **⚙️ Safe Settings & Diagnostics**
  - Live backend connection heartbeat with millisecond ping measurement.
  - Safe inspection of AI hyperparameters (Model, Context Window, Temperature) without exposing secrets.
  - Three distinct dark themes: *Dark Charcoal*, *Obsidian OLED*, and *Midnight Blue*.

- **⌨️ Global Command Palette (`⌘K` / `Ctrl+K`)**
  - Quick-switch modes, navigate views, and execute developer actions using keyboard shortcuts.

---

## 🛠️ Architecture

```
AI-SOFTWARE-ENGINEER-AGENT/
├── backend/                       # Flask REST API & Groq Inference Engine
│   ├── app.py                     # Main Flask application & route handlers
│   ├── run.py                     # Server entrypoint with auto-reloading
│   ├── config.py                  # Environment configuration
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Template for environment secrets
│   ├── services/                  # LLM invocation & memory services
│   └── tools/                     # File tools, terminal execution, code tools
│
└── frontend/                      # React 18 + Vite Modern Workspace
    ├── src/
    │   ├── components/
    │   │   ├── layout/            # Sidebar, Navbar, ActivityPanel
    │   │   ├── workspace/         # WorkspaceView, TaskInput, ExecutionItem
    │   │   ├── projects/          # ProjectsView, ProjectCard
    │   │   ├── code/              # CodeViewer, FileTree
    │   │   ├── history/           # HistoryView
    │   │   ├── logs/              # LogsView
    │   │   ├── settings/          # SettingsView
    │   │   └── common/            # CodeBlock, MarkdownRenderer, CommandPalette, Toast
    │   ├── context/               # Reactive AppContext (state management)
    │   ├── services/              # Axios API client (Centralized Render/Local API)
│   ├── .env.example           # Frontend environment template (VITE_API_URL)
    │   ├── App.jsx                # Layout orchestrator
    │   ├── main.jsx               # React DOM entrypoint
    │   └── index.css              # Custom CSS design system
    ├── index.html                 # HTML template with Google Fonts (Inter, JetBrains Mono)
    ├── vite.config.js             # Vite configuration with chunk splitting
    └── package.json               # Frontend dependencies & scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**
- A **Groq Cloud API Key** ([Get one for free at console.groq.com](https://console.groq.com/keys))

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and insert your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   ```

4. Start the Flask server:
   ```bash
   python run.py
   ```
   *The backend will start on `http://127.0.0.1:5000`.*

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set your API URL:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *In local development without `.env`, it defaults automatically to `http://localhost:5000`.*

4. Start the development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

### 4. Production Cloud Deployment

#### Backend on Render:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn wsgi:app` (or `python run.py`)
- **Environment Variables:**
  - `GROQ_API_KEY`: Your Groq Cloud API Key
  - `GROQ_MODEL`: *(Optional)* `qwen/qwen3.8-27b` or `openai/gpt-oss-120b`

#### Frontend on Vercel:
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: `https://ai-software-engineer-agent-1.onrender.com` (your deployed Render backend URL)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>⌘K</kbd> / <kbd>Ctrl + K</kbd> | Open Global Command Palette |
| <kbd>↵ Enter</kbd> | Submit task to AI agent (in input box) |
| <kbd>Shift + Enter</kbd> | Insert newline in task input |
| <kbd>Esc</kbd> | Close any open modal dialog or dropdown |

---

## 🔒 Security & Privacy

- **No Plaintext Secrets:** API keys are read exclusively from `backend/.env` using `python-dotenv` and are never exposed to the client.
- **Git Protection:** `.env` and sensitive files are strictly excluded from version control via `.gitignore`.
- **CORS Configured:** Secure cross-origin communication between the Vite frontend and Flask backend.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

