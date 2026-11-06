import React, { useState } from 'react';
import { useApp, TOOL_MODES } from '../../context/AppContext';
import MarkdownRenderer from '../common/MarkdownRenderer';
import CodeBlock from '../common/CodeBlock';
import {
  LuUser,
  LuCpu,
  LuCircleCheck,
  LuClock,
  LuCopy,
  LuCheck,
  LuRotateCw,
  LuFileCode,
  LuExternalLink,
  LuTriangleAlert,
  LuLoader
} from 'react-icons/lu';

const ExecutionItem = ({ task, onRerun }) => {
  const { setActiveView, setActiveFilePath } = useApp();
  const [activeTab, setActiveTab] = useState('rendered'); // 'rendered' | 'files' | 'raw'
  const [copied, setCopied] = useState(false);

  const isRunning = task.status === 'running';
  const isFailed = task.status === 'failed';
  const modeConfig = TOOL_MODES[task.mode] || TOOL_MODES.generator;

  const handleCopy = async () => {
    if (!task.response) return;
    try {
      await navigator.clipboard.writeText(task.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleOpenFile = (filePath) => {
    setActiveFilePath(filePath);
    setActiveView('code');
  };

  return (
    <article className="execution-card">
      {/* Execution Header */}
      <div className="execution-card-header">
        <div className="execution-card-title">
          <span className={`execution-mode-tag ${task.mode}`}>
            {modeConfig.label}
          </span>
          <span>•</span>
          <span>{task.projectName || 'General Workspace'}</span>
        </div>

        <div className="execution-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <LuClock size={12} />
            <span>{task.timestamp}</span>
          </span>

          {task.formattedDuration && (
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              ⚡ {task.formattedDuration}
            </span>
          )}

          <div
            className={`status-badge-chip ${
              isRunning ? 'running' : isFailed ? 'failed' : 'completed'
            }`}
          >
            {isRunning ? (
              <>
                <LuLoader size={11} className="spinning" />
                <span>Running</span>
              </>
            ) : isFailed ? (
              <>
                <LuTriangleAlert size={11} />
                <span>Failed</span>
              </>
            ) : (
              <>
                <LuCircleCheck size={11} />
                <span>Completed</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Prompt Box */}
      <div className="execution-prompt-box">
        <div className="user-prompt-avatar">
          <LuUser />
        </div>
        <div className="user-prompt-content">
          {task.prompt}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <div className="timeline-title">
          <LuCpu size={12} />
          <span>Execution Pipeline</span>
        </div>

        <div className="timeline-steps">
          {task.steps?.map((step) => (
            <div key={step.id} className={`timeline-step-row ${step.status}`}>
              <div className={`step-indicator-circle ${step.status}`}>
                {step.status === 'completed' ? (
                  <LuCheck size={11} />
                ) : step.status === 'running' ? (
                  <LuLoader size={11} className="spinning" />
                ) : (
                  <span>•</span>
                )}
              </div>
              <span className="step-name">{step.name}</span>
              <span className="step-duration">{step.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Output Response Section */}
      <div className="execution-output-container">
        {/* Output Toolbar */}
        <div className="output-toolbar">
          <div className="output-view-tabs">
            <button
              className={`output-tab-btn ${activeTab === 'rendered' ? 'active' : ''}`}
              onClick={() => setActiveTab('rendered')}
            >
              Rendered Solution
            </button>
            {task.files && task.files.length > 0 && (
              <button
                className={`output-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveTab('files')}
              >
                Generated Files ({task.files.length})
              </button>
            )}
            <button
              className={`output-tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
              onClick={() => setActiveTab('raw')}
            >
              Raw Output
            </button>
          </div>

          <div className="output-actions-group">
            <button
              className="output-tool-btn"
              onClick={handleCopy}
              disabled={!task.response}
              title="Copy solution text"
            >
              {copied ? (
                <>
                  <LuCheck size={12} style={{ color: '#10b981' }} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <LuCopy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>

            {onRerun && (
              <button
                className="output-tool-btn"
                onClick={() => onRerun(task.prompt, task.mode)}
                title="Rerun this task"
              >
                <LuRotateCw size={12} />
                <span>Rerun</span>
              </button>
            )}
          </div>
        </div>

        {/* Output Content Rendering */}
        {isRunning ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <LuLoader size={24} className="spinning" style={{ color: 'var(--accent-cyan)', marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>Groq AI is thinking and synthesizing code...</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
              Parsing architecture, generating implementation, and running AST checks
            </div>
          </div>
        ) : (
          <div>
            {activeTab === 'rendered' && (
              <>
                <MarkdownRenderer content={task.response} />
                {isFailed && (
                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      className="btn-primary"
                      onClick={() => onRerun && onRerun(task.prompt, task.mode)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <LuRotateCw size={13} />
                      <span>Retry Task with Active Model</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'files' && task.files && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {task.files.map((file, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <div
                      style={{
                        padding: '8px 14px',
                        background: 'var(--bg-surface-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LuFileCode size={14} style={{ color: 'var(--accent-cyan)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {file.name}
                        </span>
                      </div>
                      <button
                        className="output-tool-btn"
                        onClick={() => handleOpenFile(file.path)}
                        title="Open in Code Explorer"
                      >
                        <LuExternalLink size={12} />
                        <span>Open in Code Explorer</span>
                      </button>
                    </div>
                    <CodeBlock language={file.language} showLineNumbers={true}>
                      {file.code}
                    </CodeBlock>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'raw' && (
              <pre
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {task.response}
              </pre>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ExecutionItem;
