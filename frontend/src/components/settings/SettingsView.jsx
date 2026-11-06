import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuSettings,
  LuCpu,
  LuPalette,
  LuServer,
  LuUser,
  LuCircleCheck,
  LuCircleAlert,
  LuRefreshCw,
  LuCheck,
  LuShield
} from 'react-icons/lu';

const SettingsView = () => {
  const {
    settings,
    setSettings,
    backendStatus,
    checkHealth,
    toolsConfig
  } = useApp();

  const [checking, setChecking] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleHealthCheck = async () => {
    setChecking(true);
    await checkHealth();
    setTimeout(() => setChecking(false), 500);
  };

  const handleThemeChange = (themeName) => {
    setSettings((prev) => ({ ...prev, theme: themeName }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDefaultModeChange = (modeId) => {
    setSettings((prev) => ({ ...prev, defaultMode: modeId }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Workspace Settings</h1>
          <p className="page-desc">
            Configure autonomous agent runtime options, visual aesthetics, and inspect backend provider telemetry.
          </p>
        </div>

        {saveSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--accent-emerald)',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            <LuCheck size={16} />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <div className="settings-grid">
        {/* Backend Connection Diagnostics */}
        <div className="settings-section-card">
          <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LuServer style={{ color: 'var(--accent-cyan)' }} />
            <span>Backend Connection Status</span>
          </div>
          <div className="settings-section-desc">
            Live health verification for the Flask AI agent backend running on localhost:5000.
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Connection Endpoint</div>
              <div className="settings-label-desc" style={{ fontFamily: 'var(--font-mono)' }}>
                {settings.backendUrl}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                className={`status-badge-chip ${backendStatus.online ? 'completed' : 'failed'}`}
                style={{ padding: '5px 12px', fontSize: 12 }}
              >
                {backendStatus.online ? (
                  <>
                    <LuCircleCheck size={13} />
                    <span>Connected ({backendStatus.latency || 24}ms)</span>
                  </>
                ) : (
                  <>
                    <LuCircleAlert size={13} />
                    <span>Disconnected</span>
                  </>
                )}
              </div>

              <button
                className="btn-secondary"
                onClick={handleHealthCheck}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
              >
                <LuRefreshCw size={13} className={checking ? 'spinning' : ''} />
                <span>Test Ping</span>
              </button>
            </div>
          </div>

          {!backendStatus.online && (
            <div
              style={{
                marginTop: 14,
                padding: '12px 16px',
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                color: '#fda4af'
              }}
            >
              <strong>Backend Offline:</strong> To start the agent backend, open a terminal in the project root and run:
              <pre style={{ marginTop: 6, background: '#090d16', padding: '8px 12px', borderRadius: 4, color: '#f8fafc' }}>
                cd backend && python run.py
              </pre>
            </div>
          )}
        </div>

        {/* AI Provider & Model Information (Safe Configuration - No Secrets) */}
        <div className="settings-section-card">
          <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LuCpu style={{ color: 'var(--accent-violet)' }} />
            <span>AI Model & Provider Architecture</span>
          </div>
          <div className="settings-section-desc">
            Safe inspection of the connected LLM runtime and inference hyperparameters.
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Inference Engine Provider</div>
              <div className="settings-label-desc">Ultra-low latency hardware acceleration</div>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Groq Cloud LPU
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Active LLM Model</div>
              <div className="settings-label-desc">Open weights state-of-the-art coding and reasoning</div>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              llama-3.3-70b-versatile
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Context Window</div>
              <div className="settings-label-desc">Maximum tokens supported per generation context</div>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              128,000 tokens
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Sampling Temperature</div>
              <div className="settings-label-desc">Controls determinism vs creative problem solving</div>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              0.7 (Balanced Code & Logic)
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">API Authentication Status</div>
              <div className="settings-label-desc">Managed securely on backend server (.env)</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-emerald)', fontSize: 13, fontWeight: 600 }}>
              <LuShield size={14} />
              <span>Securely Managed on Server</span>
            </div>
          </div>
        </div>

        {/* Appearance & Themes */}
        <div className="settings-section-card">
          <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LuPalette style={{ color: 'var(--accent-cyan)' }} />
            <span>Appearance & Theme</span>
          </div>
          <div className="settings-section-desc">
            Personalize the workspace color scheme and visual contrast.
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Theme Palette</div>
              <div className="settings-label-desc">Cursor / Linear dark themes</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'dark', label: 'Dark Charcoal' },
                { id: 'obsidian', label: 'Obsidian OLED' },
                { id: 'midnight', label: 'Midnight Blue' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  className={`filter-pill ${settings.theme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* General Preferences */}
        <div className="settings-section-card">
          <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LuSettings style={{ color: 'var(--text-secondary)' }} />
            <span>Workspace Preferences</span>
          </div>
          <div className="settings-section-desc">
            Configure agent defaults and behavior.
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label-title">Default Agent Mode</div>
              <div className="settings-label-desc">Pre-selected capability on fresh workspace load</div>
            </div>

            <select
              className="form-select"
              style={{ width: 220 }}
              value={settings.defaultMode}
              onChange={(e) => handleDefaultModeChange(e.target.value)}
            >
              {Object.values(toolsConfig).map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Account Profile */}
        <div className="settings-section-card">
          <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LuUser style={{ color: 'var(--accent-emerald)' }} />
            <span>Developer Account</span>
          </div>
          <div className="settings-section-desc">
            Autonomous engineering workstation seat.
          </div>

          <div className="settings-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="user-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                AM
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Alex Mercer</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>lead.engineer@enterprise.ai</div>
              </div>
            </div>

            <div
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-gradient-subtle)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: 'var(--accent-cyan)',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              Pro AI Engineer Tier
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
