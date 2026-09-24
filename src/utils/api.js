const API_BASE = "http://127.0.0.1:5000";

export function getAuthToken() {
  return localStorage.getItem("token") || "";
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = options.token || getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Don't forward custom `token` into fetch()
  const { token: _t, ...fetchOptions } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/** First call after login — profile + full history from MongoDB */
export async function fetchMe(token) {
  return apiFetch("/auth/me", { method: "GET", token });
}

export async function updateProfile(body) {
  return apiFetch("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function saveUserGuidance(entry) {
  return apiFetch("/user/guidance", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export async function fetchUserGuidance() {
  return apiFetch("/user/guidance", { method: "GET" });
}

export async function fetchUserGuidanceItem(id) {
  return apiFetch(`/user/guidance/${id}`, { method: "GET" });
}

export async function deleteUserGuidance(id) {
  return apiFetch(`/user/guidance/${id}`, { method: "DELETE" });
}
