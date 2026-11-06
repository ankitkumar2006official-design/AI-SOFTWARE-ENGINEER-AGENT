import React, { useState, useRef, useEffect } from 'react';
import { useApp, TOOL_MODES } from '../../context/AppContext';
import {
  LuSend,
  LuSparkles,
  LuPaperclip,
  LuLoader,
  LuShieldCheck,
  LuTestTube,
  LuFileCode,
  LuCpu
} from 'react-icons/lu';

const QUICK_CHIPS = [
  { label: '+ Unit Tests', append: ' Include comprehensive unit tests with edge-case test fixtures.' },
  { label: '+ Security Audit', append: ' Follow OWASP top 10 security standards and sanitize all inputs.' },
  { label: '+ Dockerfile', append: ' Provide a multi-stage production Dockerfile and compose configuration.' },
  { label: '+ TypeScript', append: ' Ensure strict TypeScript typings and interfaces.' }
];

const TaskInput = ({ onSend, initialValue = '' }) => {
  const { activeTool, setActiveTool, currentExecution } = useApp();
  const [prompt, setPrompt] = useState(initialValue);
  const textareaRef = useRef(null);

  const isRunning = currentExecution?.status === 'running';

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    onSend(prompt.trim(), activeTool);
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (chipAppend) => {
    setPrompt((prev) => (prev ? prev.trim() + chipAppend : chipAppend.trim()));
    if (textareaRef.current) textareaRef.current.focus();
  };

  const activeModeConfig = TOOL_MODES[activeTool] || TOOL_MODES.generator;

  return (
    <div className="task-input-dock">
      <div className="task-input-panel">
        {/* Quick prompt enhancement chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Enhance:
          </span>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.append)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="task-textarea"
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeModeConfig.placeholder}
          disabled={isRunning}
        />

        <div className="task-input-footer">
          {/* Left: Tool selector & context attachment */}
          <div className="input-footer-left">
            <div
              className="input-tool-chip"
              title="Current AI Engineering Mode"
              style={{ borderColor: activeModeConfig.color }}
            >
              <LuSparkles size={12} style={{ color: activeModeConfig.color }} />
              <span style={{ fontWeight: 600 }}>{activeModeConfig.label}</span>
            </div>

            <div
              className="input-tool-chip"
              title="Add Context or File Reference"
              onClick={() => {
                setPrompt(prev => prev ? prev + ' [Context: codebase files attached]' : '[Context: codebase files attached] ');
              }}
            >
              <LuPaperclip size={12} />
              <span>Add Context</span>
            </div>
          </div>

          {/* Right: Shortcut hint & Send button */}
          <div className="input-footer-right">
            <span className="input-hint-text">
              Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: 3 }}>↵ Enter</kbd> to submit
            </span>

            <button
              className="btn-submit-task"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isRunning}
              title="Submit task to AI Engineer"
            >
              {isRunning ? (
                <>
                  <LuLoader size={14} className="spinning" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Execute Task</span>
                  <LuSend size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
