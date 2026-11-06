import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuSearch,
  LuTerminal,
  LuFolderGit2,
  LuHistory,
  LuCode,
  LuFileText,
  LuSettings,
  LuZap,
  LuBug,
  LuRocket,
  LuMessageSquare,
  LuX,
  LuCornerDownLeft
} from 'react-icons/lu';

const CommandPalette = ({ isOpen, onClose }) => {
  const { setActiveView, setActiveTool } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    // Navigation
    { id: 'nav-workspace', group: 'Navigation', label: 'Go to AI Workspace', icon: LuTerminal, action: () => setActiveView('workspace') },
    { id: 'nav-projects', group: 'Navigation', label: 'Go to Projects', icon: LuFolderGit2, action: () => setActiveView('projects') },
    { id: 'nav-code', group: 'Navigation', label: 'Open Code Explorer', icon: LuCode, action: () => setActiveView('code') },
    { id: 'nav-history', group: 'Navigation', label: 'View Task History', icon: LuHistory, action: () => setActiveView('history') },
    { id: 'nav-logs', group: 'Navigation', label: 'View Execution Telemetry Logs', icon: LuFileText, action: () => setActiveView('logs') },
    { id: 'nav-settings', group: 'Navigation', label: 'Open Settings', icon: LuSettings, action: () => setActiveView('settings') },
    
    // AI Capabilities
    { id: 'mode-gen', group: 'Agent Capabilities', label: 'Switch to AI Code Generator', icon: LuZap, color: '#38bdf8', action: () => { setActiveTool('generator'); setActiveView('workspace'); } },
    { id: 'mode-asst', group: 'Agent Capabilities', label: 'Switch to Senior Code Assistant', icon: LuMessageSquare, color: '#8b5cf6', action: () => { setActiveTool('assistant'); setActiveView('workspace'); } },
    { id: 'mode-debug', group: 'Agent Capabilities', label: 'Switch to AI Debugger', icon: LuBug, color: '#f43f5e', action: () => { setActiveTool('debugger'); setActiveView('workspace'); } },
    { id: 'mode-deploy', group: 'Agent Capabilities', label: 'Switch to DevOps & Deploy', icon: LuRocket, color: '#10b981', action: () => { setActiveTool('deploy'); setActiveView('workspace'); } },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 560, padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-default)',
            gap: 12
          }}
        >
          <LuSearch size={18} style={{ color: 'var(--accent-cyan)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'inherit'
            }}
          />
          <button
            className="sidebar-collapse-btn"
            onClick={onClose}
            style={{ padding: 4 }}
          >
            <LuX size={16} />
          </button>
        </div>

        {/* Command List */}
        <div style={{ maxHeight: 340, overflowY: 'auto', padding: '8px' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
              No commands found matching "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => { cmd.action(); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-strong)' : '1px solid transparent',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <Icon size={16} style={{ color: cmd.color || (isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)') }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{cmd.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    {cmd.group}
                  </span>
                  {isSelected && (
                    <LuCornerDownLeft size={13} style={{ color: 'var(--accent-cyan)' }} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div
          style={{
            padding: '8px 18px',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--text-dim)'
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: 3 }}>↑↓</kbd> Navigate</span>
            <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: 3 }}>↵</kbd> Select</span>
            <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: 3 }}>Esc</kbd> Close</span>
          </div>
          <span>Aether AI v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

