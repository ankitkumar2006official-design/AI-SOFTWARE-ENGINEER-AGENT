import axios from 'axios';

/**
 * Centralized API Base URL Determination
 * Supports:
 * 1. Vite Environment Variable (VITE_API_URL)
 * 2. Production fallback: Live Render Backend URL (https://ai-software-engineer-agent-1.onrender.com)
 * 3. Local development fallback: http://localhost:5000
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // When deployed to production (e.g. Vercel), default to the live Render backend
  if (import.meta.env.PROD) {
    return 'https://ai-software-engineer-agent-1.onrender.com';
  }

  // Local development default
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for complex LLM tasks & cold starts
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Health check helper that verifies backend connection and returns latency & service status
 */
export const checkBackendHealth = async () => {
  const startTime = Date.now();
  
  // Try /health first (primary production health endpoint)
  try {
    const res = await API.get('/health', { timeout: 6000 });
    const latency = Date.now() - startTime;
    return {
      online: true,
      status: res.data?.status || 'ok',
      service: res.data?.service,
      groqConfigured: res.data?.groq_configured,
      defaultModel: res.data?.default_model,
      latency,
      checkedAt: Date.now()
    };
  } catch (healthErr) {
    // Fallback probe 1: GET /test
    try {
      const testRes = await API.get('/test', { timeout: 4000 });
      const latency = Date.now() - startTime;
      return {
        online: true,
        status: testRes.data?.status || 'ok',
        latency,
        checkedAt: Date.now()
      };
    } catch (testErr) {
      // Fallback probe 2: GET /
      try {
        const rootRes = await API.get('/', { timeout: 4000 });
        const latency = Date.now() - startTime;
        return {
          online: true,
          status: 'running',
          latency,
          checkedAt: Date.now()
        };
      } catch (fallbackErr) {
        return {
          online: false,
          error: healthErr.message || 'Connection refused or backend spinning up',
          checkedAt: Date.now()
        };
      }
    }
  }
};

/**
 * Send task prompt to backend /chat endpoint
 * Matches exact backend schema: { message: string, mode: string }
 */
export const sendChatMessage = async (message, mode = 'generator') => {
  const startTime = Date.now();
  try {
    const response = await API.post('/chat', {
      message,
      mode
    });
    const durationMs = Date.now() - startTime;
    return {
      ...response.data,
      durationMs
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    // Enhanced error packaging with diagnostics
    const errorData = err.response?.data;
    const isNetworkError = !err.response && (err.message === 'Network Error' || err.code === 'ERR_NETWORK');

    const error = new Error(errorData?.error || err.message || 'Backend connection failed');
    error.response = err.response;
    error.status = err.response?.status;
    error.durationMs = durationMs;
    error.isNetworkError = isNetworkError;
    error.errorType = errorData?.error_type || (isNetworkError ? 'network_error' : 'unknown');
    throw error;
  }
};

export default API;
