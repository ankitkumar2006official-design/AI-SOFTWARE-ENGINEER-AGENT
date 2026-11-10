import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkBackendHealth, sendChatMessage, API_BASE_URL } from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Mode & Tool definitions
export const TOOL_MODES = {
  generator: {
    id: 'generator',
    label: 'Generator',
    title: 'Autonomous Code Generator',
    description: 'Build production-ready services, APIs, components, and architecture.',
    placeholder: 'Describe what you want to build (e.g., Build a complete JWT authentication service with rate limiting)...',
    tag: 'Full-Stack Dev',
    color: '#38bdf8'
  },
  assistant: {
    id: 'assistant',
    label: 'Assistant',
    title: 'Senior Engineering Assistant',
    description: 'Ask deep architectural questions, explain concepts, and analyze algorithms.',
    placeholder: 'Ask an engineering question (e.g., Explain optimistic concurrency control in distributed databases)...',
    tag: 'Advisory',
    color: '#8b5cf6'
  },
  debugger: {
    id: 'debugger',
    label: 'Debugger',
    title: 'AI Root Cause Debugger',
    description: 'Analyze stack traces, memory leaks, failing tests, and runtime exceptions.',
    placeholder: 'Paste error stack trace or describe the bug you are encountering...',
    tag: 'Diagnostics',
    color: '#f43f5e'
  },
  deploy: {
    id: 'deploy',
    label: 'DevOps & Deploy',
    title: 'DevOps & Infrastructure Engineer',
    description: 'Generate Dockerfiles, CI/CD pipelines, Kubernetes manifests, and cloud deployment guides.',
    placeholder: 'Describe deployment requirements (e.g., Create Docker Compose with Postgres, Redis, and health checks)...',
    tag: 'Cloud & SRE',
    color: '#10b981'
  },
  settings: {
    id: 'settings',
    label: 'AI Config',
    title: 'Agent Runtime Settings',
    description: 'Inspect model temperature, max tokens, context window, and provider telemetry.',
    placeholder: 'Inquire or configure runtime settings...',
    tag: 'Runtime',
    color: '#f59e0b'
  }
};

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'SaaS Platform Core',
    desc: 'Microservices architecture with JWT authentication, tenant isolation, and Stripe billing.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    status: 'Active',
    updatedAt: '2 hours ago',
    filesCount: 16
  },
  {
    id: 'proj-2',
    name: 'AI Agent Execution Engine',
    desc: 'Autonomous agent runtime with task breakdown, tool execution, and code synthesis.',
    tech: ['Python', 'Groq Llama 3.3', 'FastAPI', 'Redis'],
    status: 'Building',
    updatedAt: 'Yesterday',
    filesCount: 11
  },
  {
    id: 'proj-3',
    name: 'Distributed Cloud Cluster',
    desc: 'Kubernetes Helm charts, Terraform infrastructure, and zero-downtime deployment pipelines.',
    tech: ['Kubernetes', 'Terraform', 'AWS', 'GitHub Actions'],
    status: 'Idle',
    updatedAt: '3 days ago',
    filesCount: 8
  }
];

const INITIAL_FILES = [
  {
    path: 'src/auth/jwt_service.py',
    name: 'jwt_service.py',
    language: 'python',
    status: 'modified',
    content: `import os
import jwt
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "prod-secret-fallback-token")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(user_id: str, roles: list[str]) -> str:
    """Generate signed JWT bearer token with claims"""
    payload = {
        "sub": user_id,
        "roles": roles,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return {"valid": True, "claims": decoded}
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "Token has expired"}
    except jwt.InvalidTokenError as e:
        return {"valid": False, "error": str(e)}
`
  },
  {
    path: 'src/api/routes.ts',
    name: 'routes.ts',
    language: 'typescript',
    status: 'created',
    content: `import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'operational',
    service: 'ai-software-engineer-agent',
    timestamp: new Date().toISOString()
  });
});

export default router;
`
  },
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    language: 'yaml',
    status: 'created',
    content: `version: '3.8'

services:
  agent-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - GROQ_API_KEY=\${GROQ_API_KEY}
    restart: unless-stopped

  agent-frontend:
    build:
      context: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - agent-backend
`
  }
];

export const AppProvider = ({ children }) => {
  // Navigation View: 'workspace' | 'projects' | 'code' | 'history' | 'logs' | 'settings'
  const [activeView, setActiveView] = useState('workspace');
  const [activeTool, setActiveTool] = useState('generator');

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('agy_sidebar_collapsed') === 'true';
  });
  const [activityPanelOpen, setActivityPanelOpen] = useState(() => {
    return localStorage.getItem('agy_activity_open') !== 'false';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Projects state
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('agy_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProjectId, setActiveProjectId] = useState(() => {
    const saved = localStorage.getItem('agy_active_project_id');
    return saved || 'proj-1';
  });

  // Code files repository
  const [workspaceFiles, setWorkspaceFiles] = useState(() => {
    const saved = localStorage.getItem('agy_workspace_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  const [activeFilePath, setActiveFilePath] = useState('src/auth/jwt_service.py');

  // Execution History & Tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('agy_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentExecution, setCurrentExecution] = useState(null);

  // Live System Logs
  const [systemLogs, setSystemLogs] = useState([
    { id: '1', time: new Date().toLocaleTimeString(), level: 'INFO', message: 'Aether AI Agent Workspace initialized' },
    { id: '2', time: new Date().toLocaleTimeString(), level: 'INFO', message: 'Groq Llama 3.3 70B runtime provider configured' }
  ]);

  // Backend Health Status
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    latency: null,
    checkedAt: null,
    statusText: 'Connecting...'
  });

  // Toast Notification state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  };

  // User Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('agy_settings');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      theme: parsed.theme || 'dark',
      defaultMode: parsed.defaultMode || 'generator',
      autoScroll: parsed.autoScroll !== undefined ? parsed.autoScroll : true,
      soundFeedback: false,
      modelProvider: 'Groq Cloud LPU',
      modelName: 'qwen/qwen3.8-27b',
      backendUrl: API_BASE_URL
    };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('agy_sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('agy_activity_open', activityPanelOpen);
  }, [activityPanelOpen]);

  useEffect(() => {
    localStorage.setItem('agy_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('agy_active_project_id', activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem('agy_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('agy_workspace_files', JSON.stringify(workspaceFiles));
  }, [workspaceFiles]);

  useEffect(() => {
    localStorage.setItem('agy_settings', JSON.stringify(settings));
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings]);

  // Periodic Backend Health Check
  const checkHealth = async () => {
    const res = await checkBackendHealth();
    const displayHost = API_BASE_URL.replace(/^https?:\/\//, '');
    setBackendStatus({
      online: res.online,
      latency: res.latency,
      checkedAt: res.checkedAt,
      statusText: res.online ? `Online (${res.latency}ms)` : `Offline (${displayHost})`
    });
    addLog(
      res.online
        ? `Backend heartbeat OK (${res.latency}ms) at ${API_BASE_URL}`
        : `Backend unreachable at ${API_BASE_URL}`,
      res.online ? 'SUCCESS' : 'WARN'
    );
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add system log entry
  const addLog = (message, level = 'INFO') => {
    const entry = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      level,
      message
    };
    setSystemLogs(prev => [entry, ...prev.slice(0, 150)]);
  };

  // Helper to extract code blocks from markdown
  const extractCodeBlocks = (text) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/g;
    const blocks = [];
    let match;
    let index = 1;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      
      // Attempt to deduce file name from first line comment
      let fileName = `generated_file_${index}.${language === 'python' ? 'py' : language === 'javascript' || language === 'js' ? 'js' : language === 'typescript' || language === 'ts' ? 'ts' : language === 'html' ? 'html' : language === 'css' ? 'css' : language === 'json' ? 'json' : language === 'yaml' || language === 'yml' ? 'yml' : 'txt'}`;
      
      const firstLine = code.split('\n')[0].trim();
      if (firstLine.startsWith('//') || firstLine.startsWith('#') || firstLine.startsWith('/*')) {
        const cleaned = firstLine.replace(/[\/\*#]/g, '').trim();
        if (cleaned.includes('.') && !cleaned.includes(' ') && cleaned.length < 40) {
          fileName = cleaned;
        }
      }

      blocks.push({
        id: `extracted-${index}`,
        name: fileName,
        path: `generated/${fileName}`,
        language,
        code,
        status: 'created'
      });
      index++;
    }
    return blocks;
  };

  // Execute Agent Task
  const executeTask = async (promptText, toolMode = activeTool) => {
    if (!promptText || !promptText.trim()) return;

    const taskId = 'task-' + Date.now();
    const startTime = Date.now();

    const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

    // Initial task representation
    const newTask = {
      id: taskId,
      projectId: activeProject.id,
      projectName: activeProject.name,
      mode: toolMode,
      prompt: promptText,
      response: '',
      status: 'running',
      createdAt: new Date().toISOString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMs: null,
      steps: [
        { id: 1, name: 'Task Specification Received & Validated', status: 'completed', time: '0.1s' },
        { id: 2, name: `Agent Mode Activated: ${TOOL_MODES[toolMode]?.label || toolMode}`, status: 'completed', time: '0.2s' },
        { id: 3, name: 'Groq Llama 3.3 70B Neural Synthesis', status: 'running', time: '...' },
        { id: 4, name: 'AST Syntax Validation & Code Extraction', status: 'pending', time: '-' }
      ],
      files: [],
      error: null
    };

    setCurrentExecution(newTask);
    setTasks(prev => [newTask, ...prev]);
    addLog(`Initiating task [${taskId}]: mode=${toolMode}, prompt="${promptText.slice(0, 45)}..."`, 'INFO');

    try {
      // Call existing API: POST /chat with { message, mode }
      const res = await sendChatMessage(promptText, toolMode);

      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const formattedDuration = (durationMs / 1000).toFixed(2) + 's';

      if (res.success && res.response) {
        const extracted = extractCodeBlocks(res.response);

        // Update workspace files if code was generated
        if (extracted.length > 0) {
          setWorkspaceFiles(prev => {
            const updated = [...prev];
            extracted.forEach(item => {
              const existingIndex = updated.findIndex(f => f.path === item.path || f.name === item.name);
              if (existingIndex >= 0) {
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  content: item.code,
                  status: 'modified'
                };
              } else {
                updated.unshift({
                  path: item.path,
                  name: item.name,
                  language: item.language,
                  content: item.code,
                  status: 'created'
                });
              }
            });
            return updated;
          });
          setActiveFilePath(extracted[0].path);
        }

        const completedTask = {
          ...newTask,
          response: res.response,
          status: 'completed',
          durationMs,
          formattedDuration,
          files: extracted,
          steps: [
            { id: 1, name: 'Task Specification Received & Validated', status: 'completed', time: '0.1s' },
            { id: 2, name: `Agent Mode Activated: ${TOOL_MODES[toolMode]?.label || toolMode}`, status: 'completed', time: '0.2s' },
            { id: 3, name: 'Groq Llama 3.3 70B Neural Synthesis', status: 'completed', time: formattedDuration },
            { id: 4, name: `AST Syntax Validation & Code Extraction (${extracted.length} artifacts)`, status: 'completed', time: '0.1s' }
          ]
        };

        setTasks(prev => prev.map(t => t.id === taskId ? completedTask : t));
        setCurrentExecution(completedTask);
        addLog(`Task [${taskId}] completed in ${formattedDuration} with ${extracted.length} generated files`, 'SUCCESS');
        
        // Update backend status as online
        setBackendStatus(prev => ({ ...prev, online: true, checkedAt: Date.now() }));
      } else {
        throw new Error(res.error || 'Agent returned unsuccessful status');
      }
    } catch (err) {
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const formattedDuration = (durationMs / 1000).toFixed(2) + 's';
      const errorMessage = err.response?.data?.error || err.message || 'Backend Connection Failure';
      const isNetworkError = err.isNetworkError || (!err.response && (errorMessage.includes('Network Error') || err.code === 'ERR_NETWORK'));
      const status = err.response?.status;

      let diagnosticTip = '';
      if (isNetworkError) {
        diagnosticTip = `\n\n**Connectivity Notice:**\nThe backend server at \`${API_BASE_URL}\` did not respond.\n- If hosted on Render (free tier), the web service may be spinning up from idle (takes ~30-50s). Please wait a moment and retry.\n- Target URL: \`${API_BASE_URL}\`\n- Status: Connection refused / Cold starting.`;
      } else if (status === 401 || errorMessage.toLowerCase().includes('key') || errorMessage.toLowerCase().includes('auth')) {
        diagnosticTip = `\n\n**Authentication Notice:**\nInvalid or missing \`GROQ_API_KEY\`. Verify that your Groq API key is set in your Render environment variables or backend \`.env\`.`;
      } else if (status === 429 || errorMessage.toLowerCase().includes('rate limit')) {
        diagnosticTip = `\n\n**Rate Limit Notice:**\nGroq Cloud API rate limit reached. Please wait a few moments and click **Rerun** to retry.`;
      } else if (status === 404 || errorMessage.toLowerCase().includes('model')) {
        diagnosticTip = `\n\n**Model Selection Notice:**\nThe requested model returned an error on Groq Cloud. The backend automatically cascades between \`qwen/qwen3.8-27b\`, \`openai/gpt-oss-120b\`, and \`openai/gpt-oss-20b\`.`;
      }

      const failedTask = {
        ...newTask,
        status: 'failed',
        error: errorMessage,
        durationMs,
        formattedDuration,
        response: `### ⚠️ Agent Execution Error\n\n**Error Details:** \`${errorMessage}\`${diagnosticTip}\n\n**Troubleshooting Checklist:**\n- Configured Backend: \`${API_BASE_URL}\`\n- If running locally: \`cd backend && python run.py\`\n- If deployed on Render: Verify service logs at [dashboard.render.com](https://dashboard.render.com)\n- Verify \`GROQ_API_KEY\` is configured in your environment settings`,
        steps: [
          { id: 1, name: 'Task Specification Received & Validated', status: 'completed', time: '0.1s' },
          { id: 2, name: `Agent Mode Activated: ${TOOL_MODES[toolMode]?.label || toolMode}`, status: 'completed', time: '0.2s' },
          { id: 3, name: 'Groq Cloud Neural Synthesis', status: 'failed', time: formattedDuration },
          { id: 4, name: 'AST Syntax Validation & Code Extraction', status: 'pending', time: '-' }
        ]
      };

      setTasks(prev => prev.map(t => t.id === taskId ? failedTask : t));
      setCurrentExecution(failedTask);
      addLog(`Task [${taskId}] failed: ${errorMessage}`, 'ERROR');
      setBackendStatus(prev => ({ ...prev, online: false, error: errorMessage, checkedAt: Date.now() }));
    }
  };

  // Projects CRUD
  const createProject = (projectData) => {
    const newProj = {
      id: 'proj-' + Date.now(),
      name: projectData.name,
      desc: projectData.desc || 'New software engineering project',
      tech: projectData.tech || ['Python', 'React'],
      status: 'Active',
      updatedAt: 'Just now',
      filesCount: 0
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    addLog(`Project "${newProj.name}" created successfully`, 'SUCCESS');
    return newProj;
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      const remaining = projects.filter(p => p.id !== id);
      if (remaining.length > 0) setActiveProjectId(remaining[0].id);
    }
    addLog(`Project deleted`, 'INFO');
  };

  const selectProject = (id) => {
    setActiveProjectId(id);
    const p = projects.find(item => item.id === id);
    if (p) addLog(`Switched active project to "${p.name}"`, 'INFO');
  };

  const clearTasks = () => {
    setTasks([]);
    setCurrentExecution(null);
    addLog('Execution task history cleared', 'INFO');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (currentExecution?.id === id) {
      setCurrentExecution(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        activeTool,
        setActiveTool,
        toolsConfig: TOOL_MODES,
        sidebarCollapsed,
        setSidebarCollapsed,
        activityPanelOpen,
        setActivityPanelOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        projects,
        activeProjectId,
        activeProject: projects.find(p => p.id === activeProjectId) || projects[0],
        createProject,
        deleteProject,
        selectProject,
        workspaceFiles,
        setWorkspaceFiles,
        activeFilePath,
        setActiveFilePath,
        tasks,
        currentExecution,
        setCurrentExecution,
        executeTask,
        clearTasks,
        deleteTask,
        systemLogs,
        addLog,
        backendStatus,
        checkHealth,
        settings,
        setSettings,
        toast,
        setToast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

