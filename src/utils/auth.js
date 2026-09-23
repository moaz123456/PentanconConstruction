const KEY = 'pentacon_admin_session';

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function isAuthenticated() {
  const session = getSession();
  if (!session?.token) return false;
  if (session.expiresAtUtc && new Date(session.expiresAtUtc).getTime() <= Date.now()) {
    clearSession();
    return false;
  }
  return true;
}