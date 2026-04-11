const HISTORY_PREFIX = "careerHistory";

const sanitizeUserKey = (user) => {
  if (!user) return "guest";
  return String(user).trim().toLowerCase().replace(/\s+/g, "_");
};

export const getHistoryStorageKey = (user) => {
  return `${HISTORY_PREFIX}:${sanitizeUserKey(user)}`;
};

export const getHistoryItems = (user) => {
  try {
    const key = getHistoryStorageKey(user);
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read history:", error);
    return [];
  }
};

export const saveHistoryItems = (user, items) => {
  const key = getHistoryStorageKey(user);
  localStorage.setItem(key, JSON.stringify(items));
};

export const createHistoryEntry = ({ user, career, topCareers, fullData, skillsRaw, skillsConverted, matricInfo, intermediateInfo }) => {
  const now = new Date();
  const id = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    user: user || "guest",
    career,
    topCareers: topCareers || [],
    fullData: fullData || {},
    skillsRaw: skillsRaw || {},
    skillsConverted: skillsConverted || {},
    matric: matricInfo || {},
    intermediate: intermediateInfo || {},
    createdAt: now.toISOString()
  };
};

export const addHistoryEntry = (user, entry) => {
  const current = getHistoryItems(user);
  const updated = [entry, ...current].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  saveHistoryItems(user, updated);
  return updated;
};
