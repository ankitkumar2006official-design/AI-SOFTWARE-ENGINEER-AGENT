import React, { useState } from 'react';
import { useApp, TOOL_MODES } from '../../context/AppContext';
import {
  LuFolderGit2,
  LuChevronDown,
  LuCpu,
  LuPanelRight,
  LuMenu,
  LuRefreshCw,
  LuCircleCheck,
  LuCircleAlert,
  LuPlus
} from 'react-icons/lu';

const Navbar = () => {
  const {
    activeProject,
    projects,
    selectProject,
    activeTool,
    setActiveTool,
    activeView,
    setActiveView,
    backendStatus,
    checkHealth,
    activityPanelOpen,
    setActivityPanelOpen,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useApp();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const handleHealthRefresh = async () => {
    setCheckingHealth(true);
    await checkHealth();
    setTimeout(() => setCheckingHealth(false), 600);
  };

  return (
    <header className="top-navbar">
      {/* Left Section: Mobile toggle & Project Breadcrumb */}
      <div className="navbar-left">
        <button
          className="navbar-icon-btn mobile-menu-btn"
          style={{ display: 'none' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Toggle Mobile Menu"
        >
          <LuMenu size={16} />
        </button>

        {/* Project Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="project-selector-btn"
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            title="Switch Workspace Project"
          >
            <div className="project-status-dot" />
            <LuFolderGit2 size={14} style={{ color: '#38bdf8' }} />
            <span>{activeProject?.name || 'Select Project'}</span>
            <LuChevronDown size={13} style={{ color: '#64748b' }} />
          </button>

          {projectDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: 240,
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 50
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-dim)',
                  padding: '6px 8px',
                  textTransform: 'uppercase'
                }}
              >
                Switch Project
              </div>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    selectProject(proj.id);
                    setProjectDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12,
                    color: proj.id === activeProject?.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    background: proj.id === activeProject?.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{proj.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{proj.status}</span>
                </div>
              ))}
              <div
                onClick={() => {
                  setActiveView('projects');
                  setProjectDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  marginTop: 4,
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer'
                }}
              >
                <LuPlus size={12} />
                <span>Manage & Create Projects</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Section: Active Tool / Mode Pills */}
      {activeView === 'workspace' && (
        <div className="mode-pills-group">
          {Object.values(TOOL_MODES).map((mode) => (
            <button
              key={mode.id}
              className={`mode-pill-btn ${activeTool === mode.id ? 'active' : ''}`}
              onClick={() => setActiveTool(mode.id)}
              title={mode.description}
            >
              <span style={{ color: mode.color, fontSize: 12 }}>●</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right Section: Model Provider & Telemetry */}
      <div className="navbar-right">
        {/* Model Indicator Pill */}
        <div className="model-badge-pill" title="Inference model: Groq Cloud LPU">
          <LuCpu size={13} style={{ color: '#a78bfa' }} />
          <span>Groq AI LPU</span>
        </div>

        {/* Backend Heartbeat Status */}
        <button
          className="navbar-icon-btn"
          onClick={handleHealthRefresh}
          title={`Backend status: ${backendStatus.online ? 'Online (' + backendStatus.latency + 'ms)' : 'Offline'}. Click to test ping.`}
          style={{ gap: 6, padding: '5px 10px', fontSize: 11 }}
        >
          {backendStatus.online ? (
            <LuCircleCheck size={13} style={{ color: '#10b981' }} />
          ) : (
            <LuCircleAlert size={13} style={{ color: '#f43f5e' }} />
          )}
          <span style={{ color: backendStatus.online ? '#94a3b8' : '#f43f5e' }}>
            {backendStatus.online ? `${backendStatus.latency || 20}ms` : 'Offline'}
          </span>
          <LuRefreshCw size={11} className={checkingHealth ? 'spinning' : ''} />
        </button>

        {/* Activity Panel Toggle */}
        <button
          className={`navbar-icon-btn ${activityPanelOpen ? 'active' : ''}`}
          onClick={() => setActivityPanelOpen(!activityPanelOpen)}
          title={activityPanelOpen ? 'Hide Activity Panel' : 'Show Activity Panel'}
        >
          <LuPanelRight size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
