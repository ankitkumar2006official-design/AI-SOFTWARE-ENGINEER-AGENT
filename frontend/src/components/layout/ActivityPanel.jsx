import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuActivity,
  LuX,
  LuClock,
  LuFileCode,
  LuCpu,
  LuCircleCheck,
  LuTriangleAlert,
  LuTerminal,
  LuCopy,
  LuExternalLink
} from 'react-icons/lu';

const ActivityPanel = () => {
  const {
    activityPanelOpen,
    setActivityPanelOpen,
    currentExecution,
    activeTool,
    toolsConfig,
    systemLogs,
    setActiveView,
    setActiveFilePath
  } = useApp();

  const isRunning = currentExecution?.status === 'running';
  const isFailed = currentExecution?.status === 'failed';
  const isCompleted = currentExecution?.status === 'completed';

  const handleOpenFile = (filePath) => {
    setActiveFilePath(filePath);
    setActiveView('code');
  };

  const copyExecutionResult = () => {
    if (currentExecution?.response) {
      navigator.clipboard.writeText(currentExecution.response);
    }
  };

  return (
    <aside className={`activity-panel ${activityPanelOpen ? '' : 'closed'}`}>
      {/* Panel Header */}
      <div className="activity-header">
        <div className="activity-header-title">
          <LuActivity size={15} style={{ color: '#38bdf8' }} />
          <span>Agent Activity</span>
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setActivityPanelOpen(false)}
          title="Close Activity Panel"
        >
          <LuX size={15} />
        </button>
      </div>

      {/* Panel Body */}
      <div className="activity-body">
        {/* Agent Live Status Card */}
        <div className="activity-card-widget">
          <div className="widget-title">
            <span>Agent Status</span>
            <LuCpu size={14} style={{ color: '#8b5cf6' }} />
          </div>

          <div className="agent-live-status">
            <div
              className={`status-pulse-dot ${
                isRunning ? 'online' : isFailed ? 'offline' : 'online'
              }`}
            />
            <span
              className={`agent-status-badge ${
                isRunning ? 'running' : isFailed ? 'error' : 'idle'
              }`}
            >
              {isRunning
                ? 'Processing Task'
                : isFailed
                ? 'Execution Failed'
                : isCompleted
                ? 'Task Finished'
                : 'Agent Idle & Ready'}
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="stats-grid-widget">
            <div className="stat-item">
              <div className="stat-label">Active Mode</div>
              <div className="stat-val" style={{ fontSize: 12, color: toolsConfig[activeTool]?.color }}>
                {toolsConfig[activeTool]?.label || activeTool}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Execution Time</div>
              <div className="stat-val">
                {currentExecution?.formattedDuration || (isRunning ? 'In progress...' : '0.00s')}
              </div>
            </div>
          </div>
        </div>

        {/* Current / Last Task Summary */}
        {currentExecution && (
          <div className="activity-card-widget">
            <div className="widget-title">
              <span>Active Task</span>
              <LuClock size={13} style={{ color: '#64748b' }} />
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                background: 'var(--bg-surface)',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {currentExecution.prompt.slice(0, 160)}
              {currentExecution.prompt.length > 160 ? '...' : ''}
            </div>

            {/* Quick Actions */}
            {isCompleted && currentExecution.response && (
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button
                  className="output-tool-btn"
                  onClick={copyExecutionResult}
                  style={{ width: '100%', justifyContent: 'center' }}
                  title="Copy full AI response"
                >
                  <LuCopy size={12} />
                  <span>Copy Response</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Generated & Analyzed Code Artifacts */}
        <div className="activity-card-widget">
          <div className="widget-title">
            <span>Generated Artifacts</span>
            <LuFileCode size={13} style={{ color: '#38bdf8' }} />
          </div>

          {currentExecution?.files && currentExecution.files.length > 0 ? (
            <div className="files-list-widget">
              {currentExecution.files.map((file, idx) => (
                <div
                  key={idx}
                  className="file-item-row"
                  onClick={() => handleOpenFile(file.path)}
                  title={`Open ${file.name} in Code Explorer`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                    <LuFileCode size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                  </div>
                  <span className={`file-badge-change ${file.status || 'created'}`}>
                    {file.language}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', padding: '12px 0' }}>
              No code artifacts produced yet
            </div>
          )}
        </div>

        {/* Live Execution Stream Logs */}
        <div className="activity-card-widget">
          <div className="widget-title">
            <span>System Telemetry</span>
            <LuTerminal size={13} style={{ color: '#10b981' }} />
          </div>

          <div className="mini-log-stream">
            {systemLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="log-entry-row">
                <span className="log-entry-time">{log.time}</span>
                <span
                  style={{
                    color:
                      log.level === 'SUCCESS'
                        ? '#10b981'
                        : log.level === 'ERROR'
                        ? '#f43f5e'
                        : log.level === 'WARN'
                        ? '#f59e0b'
                        : '#94a3b8'
                  }}
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ActivityPanel;
