import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuHistory,
  LuSearch,
  LuTrash2,
  LuExternalLink,
  LuCircleCheck,
  LuTriangleAlert,
  LuClock,
  LuLoader
} from 'react-icons/lu';

const HistoryView = () => {
  const { tasks, clearTasks, deleteTask, setCurrentExecution, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'completed' | 'running' | 'failed'

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.response && t.response.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.projectName && t.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenTask = (task) => {
    setCurrentExecution(task);
    setActiveView('workspace');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Execution History</h1>
          <p className="page-desc">
            Review past agent runs, debugging sessions, code generations, and performance metrics.
          </p>
        </div>

        {tasks.length > 0 && (
          <button
            className="btn-secondary"
            onClick={clearTasks}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f43f5e' }}
          >
            <LuTrash2 size={14} />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="page-controls-bar">
        <div className="search-input-wrapper">
          <LuSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search past executions by prompt, project, or mode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills-bar">
          {['all', 'completed', 'running', 'failed'].map((status) => (
            <button
              key={status}
              className={`filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
              style={{ textTransform: 'capitalize' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="history-table-container">
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            <LuHistory size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
              No execution records match your filter criteria.
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Submit tasks from the AI Workspace to build up execution history.
            </div>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Task Description</th>
                <th>Mode</th>
                <th>Project</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Date / Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 380
                      }}
                      title={t.prompt}
                    >
                      {t.prompt}
                    </div>
                  </td>
                  <td>
                    <span className={`execution-mode-tag ${t.mode}`}>
                      {t.mode}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {t.projectName || 'Default'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge-chip ${t.status}`}>
                      {t.status === 'running' ? (
                        <>
                          <LuLoader size={10} className="spinning" />
                          <span>Running</span>
                        </>
                      ) : t.status === 'failed' ? (
                        <>
                          <LuTriangleAlert size={10} />
                          <span>Failed</span>
                        </>
                      ) : (
                        <>
                          <LuCircleCheck size={10} />
                          <span>Success</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {t.formattedDuration || '-'}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {t.timestamp}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="output-tool-btn"
                        onClick={() => handleOpenTask(t)}
                        title="View details in workspace"
                      >
                        <LuExternalLink size={12} />
                        <span>View</span>
                      </button>
                      <button
                        className="output-tool-btn"
                        onClick={() => deleteTask(t.id)}
                        title="Delete record"
                        style={{ color: '#f43f5e' }}
                      >
                        <LuTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
