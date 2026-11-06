import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import ActivityPanel from './components/layout/ActivityPanel';
import WorkspaceView from './components/workspace/WorkspaceView';
import ProjectsView from './components/projects/ProjectsView';
import CodeViewer from './components/code/CodeViewer';
import HistoryView from './components/history/HistoryView';
import LogsView from './components/logs/LogsView';
import SettingsView from './components/settings/SettingsView';
import CommandPalette from './components/common/CommandPalette';
import Toast from './components/common/Toast';

const MainLayout = () => {
  const { activeView } = useApp();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for Command Palette: Cmd/Ctrl + K
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow" />

      {/* Left Sidebar */}
      <Sidebar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Center Main Workspace Area */}
      <div className="workspace-wrapper">
        <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        {/* View Switcher */}
        {activeView === 'workspace' && <WorkspaceView />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'code' && <CodeViewer />}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'logs' && <LogsView />}
        {activeView === 'settings' && <SettingsView />}
      </div>

      {/* Right Activity Panel */}
      <ActivityPanel />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
