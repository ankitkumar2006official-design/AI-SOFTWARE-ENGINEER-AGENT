import { useState } from "react";
import API from "../services/api";

function ChatBox() {

  // =========================
  // STATES
  // =========================

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeTool, setActiveTool] =
    useState("generator");

  // =========================
  // TOOL CONFIG
  // =========================

  const tools = {

    generator: {
      title: "Build Software Using AI",
      description:
        "Generate production-ready projects and code.",
      placeholder:
        "Create full stack AI project..."
    },

    assistant: {
      title: "Smart Coding Assistant",
      description:
        "Ask coding questions and concepts.",
      placeholder:
        "Explain React hooks..."
    },

    debugger: {
      title: "AI Debugger",
      description:
        "Fix bugs and errors instantly.",
      placeholder:
        "Paste error here..."
    },

    deploy: {
      title: "Deployment Assistant",
      description:
        "Deploy websites and applications.",
      placeholder:
        "How to deploy React app?"
    },

    settings: {
      title: "AI Settings",
      description:
        "Customize your AI assistant.",
      placeholder:
        "Change AI model..."
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {

    if (!message) return;

    // USER MESSAGE

    const userMessage = {
      sender: "user",
      text: message
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    try {

      setLoading(true);

      // API CALL

      const res = await API.post("/chat", {

        message,
        mode: activeTool

      });

      // AI MESSAGE

      const aiMessage = {
        sender: "ai",
        text: res.data.response
      };

      setMessages((prev) => [
        ...prev,
        aiMessage
      ]);

    } catch (error) {

      console.log(error);

      const errorMessage = {
        sender: "ai",
        text: "Backend Connection Error"
      };

      setMessages((prev) => [
        ...prev,
        errorMessage
      ]);

    } finally {

      setLoading(false);

      setMessage("");
    }
  };

  return (

    <div className="app">

      {/* ===================== */}
      {/* SIDEBAR */}
      {/* ===================== */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-circle"></div>

          <h2>immincode AI</h2>

        </div>

        <div className="nav-links">

          <div
            className={`nav-item ${
              activeTool === "generator"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTool("generator")
            }
          >
            ⚡ AI Generator
          </div>

          <div
            className={`nav-item ${
              activeTool === "assistant"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTool("assistant")
            }
          >
            💻 Code Assistant
          </div>

          <div
            className={`nav-item ${
              activeTool === "debugger"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTool("debugger")
            }
          >
            🐞 Debugger
          </div>

          <div
            className={`nav-item ${
              activeTool === "deploy"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTool("deploy")
            }
          >
            🚀 Deploy
          </div>

          <div
            className={`nav-item ${
              activeTool === "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTool("settings")
            }
          >
            ⚙ Settings
          </div>

        </div>

      </aside>

      {/* ===================== */}
      {/* MAIN */}
      {/* ===================== */}

      <main className="main">

        {/* HERO */}

        <div className="hero">

          <h1>

            {tools[activeTool].title}

          </h1>

          <p>

            {tools[activeTool].description}

          </p>

        </div>

        {/* CHAT PANEL */}

        <div className="chat-panel">

          {/* CHAT MESSAGES */}

          <div className="messages-container">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "ai-message"
                }
              >

                <pre>

                  {msg.text}

                </pre>

              </div>

            ))}

            {/* LOADING */}

            {loading && (

              <div className="typing-loader">

                AI is thinking...

              </div>

            )}

          </div>

          {/* INPUT */}

          <div className="input-area">

            <textarea
              rows="4"
              placeholder={
                tools[activeTool].placeholder
              }
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button onClick={sendMessage}>

              Generate

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ChatBox;