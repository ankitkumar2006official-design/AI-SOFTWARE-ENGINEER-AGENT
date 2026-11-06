import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuFileText,
  LuSearch,
  LuTerminal,
  LuTrash2,
  LuDownload,
  LuFilter
} from 'react-icons/lu';

const LogsView = () => {
  const { systemLogs } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredLogs = systemLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const exportLogs = () => {
    const logText = systemLogs
      .map((l) => `[${l.time}] [${l.level}] ${l.message}`)
      .join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-agent-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Execution Logs & Telemetry</h1>
          <p className="page-desc">
            Raw event telemetry stream from backend inference requests, tool dispatches, and AST parsing.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={exportLogs}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <LuDownload size={14} />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Controls */}
      <div className="page-controls-bar">
        <div className="search-input-wrapper">
          <LuSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search telemetry events..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        <div className="filter-pills-bar">
          {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              className={`filter-pill ${levelFilter === lvl ? 'active' : ''}`}
              onClick={() => setLevelFilter(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Display */}
      <div
        style={{
          background: '#090d16',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div
          style={{
            padding: '10px 16px',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
            <LuTerminal size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>stdout / stream telemetry</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {filteredLogs.length} events logged
          </span>
        </div>

        <div
          style={{
            padding: 16,
            minHeight: 400,
            maxHeight: 580,
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 1.7,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                paddingBottom: 4
              }}
            >
              <span style={{ color: 'var(--text-dim)', minWidth: 70 }}>
                {log.time}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  minWidth: 64,
                  color:
                    log.level === 'SUCCESS'
                      ? '#10b981'
                      : log.level === 'ERROR'
                      ? '#f43f5e'
                      : log.level === 'WARN'
                      ? '#f59e0b'
                      : '#38bdf8'
                }}
              >
                [{log.level}]
              </span>
              <span style={{ color: '#cbd5e1', wordBreak: 'break-all' }}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsView;

