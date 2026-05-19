const BASE_URL = (import.meta.env.VITE_BACKEND_API ?? 'http://localhost:8000/').replace(/\/$/, '');

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data as { access_token: string; token_type: string; user: UserProfile };
}

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Registration failed');
  return data as { access_token: string; token_type: string; user: UserProfile };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function fetchSessions(skip = 0, limit = 50) {
  const res = await fetch(`${BASE_URL}/api/sessions/?skip=${skip}&limit=${limit}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch sessions');
  return data as { sessions: PastSession[]; total: number };
}

export async function fetchSession(sessionId: string) {
  const res = await fetch(`${BASE_URL}/api/sessions/${sessionId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Session not found');
  return data as SessionDetail;
}

export async function deleteSession(sessionId: string) {
  const res = await fetch(`${BASE_URL}/api/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Delete failed');
  }
  return true;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  api_key: string;
}

export interface PastSession {
  id: string;
  filename: string;
  file_size: number;
  created_at: string;
  message_count: number;
  summary_title: string;
  qdrant_session_id: string;
}

export interface SessionDetail {
  id: string;
  filename: string;
  file_size: number;
  created_at: string;
  qdrant_session_id: string;
  summary: Record<string, any>;
  messages: ChatMessageRecord[];
}

export interface ChatMessageRecord {
  id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}
