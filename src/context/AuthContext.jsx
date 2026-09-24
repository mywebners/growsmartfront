import React, { createContext, useCallback, useEffect, useState } from "react";
import { fetchMe, updateProfile as apiUpdateProfile } from "../utils/api";

export const AuthContext = createContext();

function safeParseJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [profile, setProfile] = useState(() =>
    safeParseJSON("profile", null)
  );
  const [guidanceHistory, setGuidanceHistory] = useState([]);
  const [historyByType, setHistoryByType] = useState(null);
  const [historyCounts, setHistoryCounts] = useState(null);
  const [meLoading, setMeLoading] = useState(false);
  const [meError, setMeError] = useState("");

  const [educationLevel, setEducationLevelState] = useState(
    () => localStorage.getItem("educationLevel") || null
  );
  const [matricData, setMatricDataState] = useState(() =>
    safeParseJSON("matricData", null)
  );
  const [matricCompleted, setMatricCompletedState] = useState(
    () => localStorage.getItem("matricCompleted") === "true"
  );
  const [matricMarks, setMatricMarksState] = useState(() =>
    safeParseJSON("matricMarks", {})
  );
  const [intermediateMarks, setIntermediateMarksState] = useState(() =>
    safeParseJSON("intermediateMarks", {})
  );
  const [matricStream, setMatricStreamState] = useState(() =>
    localStorage.getItem("matricStream") || null
  );
  const [intermediateStream, setIntermediateStreamState] = useState(() =>
    localStorage.getItem("intermediateStream") || null
  );
  const [guidanceType, setGuidanceTypeState] = useState(
    () => localStorage.getItem("guidanceType") || null
  );
  const [studyGoal, setStudyGoalState] = useState(
    () => localStorage.getItem("studyGoal") || null
  );
  const [jobsGoal, setJobsGoalState] = useState(
    () => localStorage.getItem("jobsGoal") || null
  );

  const applyMePayload = useCallback((data) => {
    const p = data?.profile || null;
    if (p) {
      setProfile(p);
      setUser(p.name || "");
      localStorage.setItem("user", p.name || "");
      localStorage.setItem("profile", JSON.stringify(p));
    }
    const list = Array.isArray(data?.guidance)
      ? data.guidance
      : Array.isArray(data?.history?.all)
        ? data.history.all
        : [];
    setGuidanceHistory(list);
    setHistoryByType(data?.history || null);
    setHistoryCounts(data?.counts || null);
  }, []);

  const refreshMe = useCallback(
    async (tokenOverride) => {
      const t = tokenOverride || localStorage.getItem("token");
      if (!t) {
        setGuidanceHistory([]);
        setHistoryByType(null);
        setHistoryCounts(null);
        return null;
      }
      setMeLoading(true);
      setMeError("");
      try {
        const data = await fetchMe(t);
        applyMePayload(data);
        return data;
      } catch (err) {
        setMeError(err.message || "Could not load account");
        if (err.status === 401) {
          setToken(null);
          setUser(null);
          setProfile(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("profile");
        }
        return null;
      } finally {
        setMeLoading(false);
      }
    },
    [applyMePayload]
  );

  // After refresh / reopen: if JWT exists, load profile + history first
  useEffect(() => {
    if (token) {
      refreshMe(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (tokenValue, name, extra = {}) => {
    setToken(tokenValue);
    setUser(name);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", name);
    if (extra.email || extra.image !== undefined) {
      const p = {
        name,
        email: extra.email || "",
        image: extra.image || "",
      };
      setProfile(p);
      localStorage.setItem("profile", JSON.stringify(p));
    }
    // First API after login
    return refreshMe(tokenValue);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    setGuidanceHistory([]);
    setHistoryByType(null);
    setHistoryCounts(null);
    setMeError("");
    setEducationLevelState(null);
    setMatricDataState(null);
    setMatricCompletedState(false);
    setMatricMarksState({});
    setIntermediateMarksState({});
    setMatricStreamState(null);
    setIntermediateStreamState(null);
    setGuidanceTypeState(null);
    setStudyGoalState(null);
    setJobsGoalState(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    localStorage.removeItem("educationLevel");
    localStorage.removeItem("matricData");
    localStorage.removeItem("matricCompleted");
    localStorage.removeItem("matricMarks");
    localStorage.removeItem("intermediateMarks");
    localStorage.removeItem("matricStream");
    localStorage.removeItem("intermediateStream");
    localStorage.removeItem("guidanceType");
    localStorage.removeItem("studyGoal");
    localStorage.removeItem("jobsGoal");
  };

  const updateProfile = async (body) => {
    const data = await apiUpdateProfile(body);
    applyMePayload(data);
    return data;
  };

  const setEducationLevel = (level) => {
    setEducationLevelState(level);
    localStorage.setItem("educationLevel", level);
  };

  const setMatricData = (data) => {
    setMatricDataState(data);
    localStorage.setItem("matricData", JSON.stringify(data));
  };

  const setMatricCompleted = (completed) => {
    setMatricCompletedState(completed);
    localStorage.setItem("matricCompleted", String(completed));
  };

  const setMatricMarks = (stream, marks) => {
    setMatricMarksState((prev) => {
      const newMarks = { ...prev, [stream]: marks };
      localStorage.setItem("matricMarks", JSON.stringify(newMarks));
      return newMarks;
    });
  };

  const setIntermediateMarks = (stream, marks) => {
    setIntermediateMarksState((prev) => {
      const newMarks = { ...prev, [stream]: marks };
      localStorage.setItem("intermediateMarks", JSON.stringify(newMarks));
      return newMarks;
    });
  };

  const setMatricStream = (stream) => {
    setMatricStreamState(stream);
    if (stream) {
      localStorage.setItem("matricStream", stream);
    } else {
      localStorage.removeItem("matricStream");
    }
  };

  const setIntermediateStream = (stream) => {
    setIntermediateStreamState(stream);
    if (stream) {
      localStorage.setItem("intermediateStream", stream);
    } else {
      localStorage.removeItem("intermediateStream");
    }
  };

  const setGuidanceType = (type) => {
    setGuidanceTypeState(type);
    if (type) {
      localStorage.setItem("guidanceType", type);
    } else {
      localStorage.removeItem("guidanceType");
    }
  };

  const setStudyGoal = (goal) => {
    setStudyGoalState(goal);
    if (goal) {
      localStorage.setItem("studyGoal", goal);
    } else {
      localStorage.removeItem("studyGoal");
    }
  };

  const setJobsGoal = (goal) => {
    setJobsGoalState(goal);
    if (goal) {
      localStorage.setItem("jobsGoal", goal);
    } else {
      localStorage.removeItem("jobsGoal");
    }
  };

  const resetAssessment = () => {
    setEducationLevelState(null);
    setMatricDataState(null);
    setMatricCompletedState(false);
    setMatricMarksState({});
    setIntermediateMarksState({});
    setMatricStreamState(null);
    setIntermediateStreamState(null);
    setGuidanceTypeState(null);
    setStudyGoalState(null);
    setJobsGoalState(null);

    localStorage.removeItem("educationLevel");
    localStorage.removeItem("matricData");
    localStorage.removeItem("matricCompleted");
    localStorage.removeItem("matricMarks");
    localStorage.removeItem("intermediateMarks");
    localStorage.removeItem("matricStream");
    localStorage.removeItem("intermediateStream");
    localStorage.removeItem("guidanceType");
    localStorage.removeItem("studyGoal");
    localStorage.removeItem("jobsGoal");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        guidanceHistory,
        historyByType,
        historyCounts,
        meLoading,
        meError,
        refreshMe,
        updateProfile,
        educationLevel,
        setEducationLevel,
        matricData,
        setMatricData,
        matricCompleted,
        setMatricCompleted,
        matricMarks,
        setMatricMarks,
        matricStream,
        setMatricStream,
        intermediateMarks,
        setIntermediateMarks,
        intermediateStream,
        setIntermediateStream,
        guidanceType,
        setGuidanceType,
        studyGoal,
        setStudyGoal,
        jobsGoal,
        setJobsGoal,
        resetAssessment,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
