import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CodeBlock from '../common/CodeBlock';
import {
  LuFolder,
  LuFolderOpen,
  LuFileCode,
  LuSearch,
  LuCopy,
  LuCheck,
  LuCode,
  LuFilePlus,
  LuDownload,
  LuX
} from 'react-icons/lu';

const CodeViewer = () => {
  const { workspaceFiles, activeFilePath, setActiveFilePath } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Group files into logical folders
  const activeFile =
    workspaceFiles.find((f) => f.path === activeFilePath) ||
    workspaceFiles[0] || {
      name: 'README.md',
      path: 'README.md',
      language: 'markdown',
      content: '# Workspace\n\nNo files generated yet. Run an agent task to generate code.'
    };

  const filteredFiles = workspaceFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async () => {
    if (!activeFile?.content) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!activeFile?.content) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name || 'code.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = activeFile.content ? activeFile.content.split('\n').length : 0;
  const fileSizeKb = activeFile.content ? (new Blob([activeFile.content]).size / 1024).toFixed(1) : 0;

  return (
    <div className="code-viewer-container">
      {/* File Explorer Sidebar */}
      <div className="file-explorer-sidebar">
        <div className="file-explorer-header">
          <span>Workspace Explorer</span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            {workspaceFiles.length} files
          </span>
        </div>

        {/* Filter Input */}
        <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <LuSearch
              size={12}
              style={{ position: 'absolute', left: 8, color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px 8px 5px 26px',
                fontSize: 11,
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* File Tree */}
        <div className="file-tree-container">
          {filteredFiles.map((file) => {
            const isActive = file.path === activeFile.path;
            return (
              <div
                key={file.path}
                className={`tree-file-row ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFilePath(file.path)}
                title={file.path}
              >
                <LuFileCode size={13} style={{ color: isActive ? '#38bdf8' : '#94a3b8' }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
                {file.status && (
                  <span
                    className={`file-badge-change ${file.status}`}
                    style={{ fontSize: 9 }}
                  >
                    {file.status === 'created' ? 'NEW' : 'MOD'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor & Code Body */}
      <div className="file-editor-area">
        {/* Editor Tabs Bar */}
        <div className="editor-tabs-bar">
          <div className="editor-tab-item active">
            <LuFileCode size={13} style={{ color: '#38bdf8' }} />
            <span>{activeFile.name}</span>
          </div>
        </div>

        {/* Breadcrumbs Bar */}
        <div className="editor-breadcrumbs-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>root</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{activeFile.path}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              {lineCount} lines • {fileSizeKb} KB
            </span>

            <button
              className="output-tool-btn"
              onClick={handleCopy}
              title="Copy file contents"
              style={{ padding: '3px 8px' }}
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

            <button
              className="output-tool-btn"
              onClick={handleDownload}
              title="Download file to local machine"
              style={{ padding: '3px 8px' }}
            >
              <LuDownload size={12} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="editor-code-body">
          <CodeBlock language={activeFile.language || 'text'} showLineNumbers={true}>
            {activeFile.content}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
