import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuFolderGit2,
  LuPlus,
  LuSearch,
  LuExternalLink,
  LuTrash2,
  LuLayers,
  LuClock,
  LuCircleCheck,
  LuX
} from 'react-icons/lu';

const ProjectsView = () => {
  const {
    projects,
    activeProjectId,
    selectProject,
    createProject,
    deleteProject,
    setActiveView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'Active' | 'Building' | 'Idle'
  const [modalOpen, setModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || proj.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenProject = (id) => {
    selectProject(id);
    setActiveView('workspace');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const techArray = newProjectTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createProject({
      name: newProjectName.trim(),
      desc: newProjectDesc.trim() || 'Software engineering repository',
      tech: techArray.length > 0 ? techArray : ['Full-Stack']
    });

    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Engineering Projects</h1>
          <p className="page-desc">
            Manage your autonomous software engineering workspaces, code repositories, and pipelines.
          </p>
        </div>
        <button
          className="btn-new-task"
          onClick={() => setModalOpen(true)}
          style={{ width: 'auto', padding: '10px 18px' }}
        >
          <LuPlus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div className="page-controls-bar">
        <div className="search-input-wrapper">
          <LuSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by name, stack, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills-bar">
          {['all', 'Active', 'Building', 'Idle'].map((filter) => (
            <button
              key={filter}
              className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'all' ? 'All Projects' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((proj) => {
          const isSelected = proj.id === activeProjectId;
          return (
            <div
              key={proj.id}
              className={`project-card-item ${isSelected ? 'selected' : ''}`}
            >
              <div>
                <div className="project-card-top">
                  <div className="project-card-icon">
                    <LuFolderGit2 />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color:
                        proj.status === 'Active'
                          ? '#10b981'
                          : proj.status === 'Building'
                          ? '#38bdf8'
                          : '#94a3b8'
                    }}
                  >
                    <span style={{ fontSize: 8 }}>●</span>
                    <span>{proj.status}</span>
                  </div>
                </div>

                <div className="project-card-name">{proj.name}</div>
                <div className="project-card-desc">{proj.desc}</div>

                <div className="project-card-tags">
                  {proj.tech?.map((tag, idx) => (
                    <span key={idx} className="project-tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project-card-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LuClock size={12} />
                  <span>{proj.updatedAt}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className="btn-open-project"
                    onClick={() => handleOpenProject(proj.id)}
                  >
                    <span>Open in Workspace</span>
                    <LuExternalLink size={12} />
                  </button>

                  {projects.length > 1 && (
                    <button
                      className="output-tool-btn"
                      onClick={() => deleteProject(proj.id)}
                      title="Delete Project"
                      style={{ padding: '6px 8px', color: '#f43f5e' }}
                    >
                      <LuTrash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal Dialog */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create New Project</div>
              <button
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g., Payment Gateway Microservice"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Briefly describe the purpose and architecture of this project..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technology Stack (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Python, FastAPI, PostgreSQL, Docker"
                  value={newProjectTech}
                  onChange={(e) => setNewProjectTech(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
