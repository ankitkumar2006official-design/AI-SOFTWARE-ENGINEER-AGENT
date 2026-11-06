import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import ExecutionItem from './ExecutionItem';
import TaskInput from './TaskInput';
import {
  LuSparkles,
  LuShieldCheck,
  LuBug,
  LuBoxes,
  LuTestTube,
  LuRocket,
  LuCode,
  LuTrash2
} from 'react-icons/lu';

const EXAMPLE_PROMPTS = [
  {
    icon: LuShieldCheck,
    tag: 'Security & Auth',
    mode: 'generator',
    title: 'Complete Authentication System',
    prompt: 'Build a production-ready JWT authentication system in Python with password hashing (bcrypt), refresh tokens, and rate-limiting middleware.'
  },
  {
    icon: LuBug,
    tag: 'Debugging',
    mode: 'debugger',
    title: 'Analyze & Fix Concurrency Bug',
    prompt: 'Diagnose and fix a race condition where multiple concurrent requests to the order checkout endpoint cause double-spending.'
  },
  {
    icon: LuBoxes,
    tag: 'Architecture',
    mode: 'generator',
    title: 'Refactor to Clean Repository Pattern',
    prompt: 'Refactor a monolithic database access module into a clean Repository Pattern with dependency injection and mockable interfaces.'
  },
  {
    icon: LuTestTube,
    tag: 'Quality Assurance',
    mode: 'assistant',
    title: 'Generate Comprehensive Test Suite',
    prompt: 'Write comprehensive unit and integration test fixtures with edge-case coverage and mock services for my API endpoints.'
  },
  {
    icon: LuRocket,
    tag: 'DevOps & Deploy',
    mode: 'deploy',
    title: 'Production Docker & CI/CD Pipeline',
    prompt: 'Create a multi-stage Dockerfile and GitHub Actions CI/CD workflow that tests, builds, and deploys a Python Flask + React application.'
  },
  {
    icon: LuCode,
    tag: 'Code Review',
    mode: 'assistant',
    title: 'Codebase Security & Performance Audit',
    prompt: 'Perform an in-depth security and performance review of my API routes, checking for SQL injection, memory leaks, and unhandled promises.'
  }
];

const WorkspaceView = () => {
  const { tasks, executeTask, activeTool, setActiveTool, clearTasks } = useApp();
  const [prefilledPrompt, setPrefilledPrompt] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new tasks are added
  useEffect(() => {
    if (tasks.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tasks]);

  const handlePromptSelect = (promptItem) => {
    setActiveTool(promptItem.mode);
    setPrefilledPrompt(promptItem.prompt);
  };

  const handleTaskSubmit = (prompt, mode) => {
    executeTask(prompt, mode);
    setPrefilledPrompt('');
  };

  return (
    <div className="workspace-viewport">
      {/* Scrollable messages and history container */}
      <div className="chat-messages-scroll-area">
        {tasks.length === 0 ? (
          <div className="welcome-hero">
            <div className="welcome-chip">
              <LuSparkles size={13} />
              <span>Autonomous AI Software Engineer</span>
            </div>

            <h1 className="welcome-title">
              What do you want to build or engineer today?
            </h1>

            <p className="welcome-subtitle">
              Harness the intelligence of Groq-accelerated models to generate clean production code,
              diagnose hard bugs, design scalable architectures, and automate cloud deployments.
            </p>

            <div className="example-prompts-grid">
              {EXAMPLE_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="prompt-card"
                    onClick={() => handlePromptSelect(item)}
                    title="Click to load prompt into input"
                  >
                    <div className="prompt-card-header">
                      <div className="prompt-card-icon">
                        <Icon size={14} />
                      </div>
                      <span className="prompt-card-tag">{item.tag}</span>
                    </div>
                    <div className="prompt-card-text">{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>
                      {item.prompt.slice(0, 80)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="execution-stream">
            <div className="stream-header-bar">
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Session Stream ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
              </div>
              <button
                className="output-tool-btn"
                onClick={clearTasks}
                style={{ color: '#f43f5e' }}
                title="Clear current stream and start fresh"
              >
                <LuTrash2 size={12} />
                <span>Clear Stream</span>
              </button>
            </div>

            {tasks.map((task) => (
              <ExecutionItem
                key={task.id}
                task={task}
                onRerun={(prompt, mode) => handleTaskSubmit(prompt, mode)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Pinned Bottom Input Dock - Permanently outside the scroll area */}
      <div className="chat-bottom-dock">
        <TaskInput
          initialValue={prefilledPrompt}
          onSend={(prompt, mode) => handleTaskSubmit(prompt, mode)}
        />
      </div>
    </div>
  );
};

export default WorkspaceView;
