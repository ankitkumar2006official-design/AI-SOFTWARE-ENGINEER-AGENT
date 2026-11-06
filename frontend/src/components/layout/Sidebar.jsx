import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuTerminal,
  LuFolderGit2,
  LuHistory,
  LuCode,
  LuFileText,
  LuSettings,
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
  LuZap,
  LuMessageSquare,
  LuBug,
  LuRocket,
  LuSlidersHorizontal
} from 'react-icons/lu';

const Sidebar = ({ onOpenCommandPalette }) => {
  const {
    activeView,
    setActiveView,
    activeTool,
    setActiveTool,
    sidebarCollapsed,
    setSidebarCollapsed,
    backendStatus,
    tasks,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useApp();

  const navItems = [
    { id: 'workspace', label: 'AI Workspace', icon: LuTerminal },
    { id: 'projects', label: 'Projects', icon: LuFolderGit2 },
    { id: 'history', label: 'Task History', icon: LuHistory, badge: tasks.length > 0 ? tasks.length : null },
    { id: 'code', label: 'Code Explorer', icon: LuCode },
    { id: 'logs', label: 'Execution Logs', icon: LuFileText },
    { id: 'settings', label: 'Settings', icon: LuSettings }
  ];

  const modeShortcuts = [
    { id: 'generator', label: 'AI Generator', icon: LuZap, color: '#38bdf8' },
    { id: 'assistant', label: 'Code Assistant', icon: LuMessageSquare, color: '#8b5cf6' },
    { id: 'debugger', label: 'AI Debugger', icon: LuBug, color: '#f43f5e' },
    { id: 'deploy', label: 'DevOps & Deploy', icon: LuRocket, color: '#10b981' },
    { id: 'settings', label: 'Runtime Config', icon: LuSlidersHorizontal, color: '#f59e0b' }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  const handleModeClick = (modeId) => {
    setActiveTool(modeId);
    setActiveView('workspace');
    setMobileMenuOpen(false);
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Header / Brand */}
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo-icon">
            <LuZap />
          </div>
          {!sidebarCollapsed && (
            <div className="brand-text">
              <span className="brand-title">Aether AI</span>
              <span className="brand-badge">Autonomous Engineer</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <LuChevronRight size={16} /> : <LuChevronLeft size={16} />}
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="sidebar-action-wrapper">
        <button
          className="btn-new-task"
          onClick={() => {
            if (onOpenCommandPalette) onOpenCommandPalette();
            else setActiveView('workspace');
            setMobileMenuOpen(false);
          }}
          title="Open Command Palette (⌘K)"
        >
          <LuPlus size={16} />
          <span>New Task</span>
          <span className="kbd-shortcut">⌘K</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav-scrollable">
        {/* Main Navigation */}
        <div>
          <div className="nav-section-title">Navigation</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    title={item.label}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* AI Modes / Tools */}
        <div>
          <div className="nav-section-title">Agent Capabilities</div>
          <ul className="nav-list">
            {modeShortcuts.map((mode) => {
              const Icon = mode.icon;
              const isModeActive = activeTool === mode.id && activeView === 'workspace';
              return (
                <li key={mode.id}>
                  <button
                    className={`nav-item-btn ${isModeActive ? 'active' : ''}`}
                    onClick={() => handleModeClick(mode.id)}
                    title={mode.label}
                  >
                    <Icon className="nav-icon" style={{ color: mode.color }} />
                    <span className="nav-label">{mode.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* Backend Connectivity Status */}
        <div className="backend-indicator-card" title={`Backend: ${backendStatus.online ? 'Online' : 'Offline'}`}>
          <div className={`status-pulse-dot ${backendStatus.online ? 'online' : 'offline'}`} />
          {!sidebarCollapsed && (
            <div className="backend-info-text">
              <span className="backend-info-title">
                {backendStatus.online ? 'Groq Engine Ready' : 'Backend Offline'}
              </span>
              <span className="backend-info-sub">
                {backendStatus.online ? `${backendStatus.latency || 24}ms latency` : 'localhost:5000'}
              </span>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          className="user-profile-bar"
          onClick={() => setActiveView('settings')}
          title="Account Settings"
        >
          <div className="user-avatar">AM</div>
          {!sidebarCollapsed && (
            <div className="user-meta">
              <span className="user-name">Alex Mercer</span>
              <span className="user-role">Lead Engineer • Pro Tier</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
