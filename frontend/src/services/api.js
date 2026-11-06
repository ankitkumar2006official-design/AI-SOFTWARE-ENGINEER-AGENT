import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 120000 // 2 minutes timeout for long-running LLM generation
});

/**
 * Health check helper that verifies backend connection and returns latency
 */
export const checkBackendHealth = async () => {
  const startTime = Date.now();
  try {
    const res = await API.get('/test', { timeout: 3500 });
    const latency = Date.now() - startTime;
    return {
      online: true,
      status: res.data?.status || 'ok',
      latency,
      checkedAt: Date.now()
    };
  } catch (err) {
    // Also try root endpoint as fallback
    try {
      const rootRes = await API.get('/', { timeout: 3500 });
      const latency = Date.now() - startTime;
      return {
        online: true,
        status: rootRes.data || 'running',
        latency,
        checkedAt: Date.now()
      };
    } catch (fallbackErr) {
      return {
        online: false,
        error: err.message || 'Connection refused',
        checkedAt: Date.now()
      };
    }
  }
};

/**
 * Send chat message to backend /chat endpoint
 * Matches exact backend schema: { message: string, mode: string }
 */
export const sendChatMessage = async (message, mode = 'generator') => {
  const startTime = Date.now();
  const response = await API.post('/chat', {
    message,
    mode
  });
  const durationMs = Date.now() - startTime;
  return {
    ...response.data,
    durationMs
  };
};

export default API;
