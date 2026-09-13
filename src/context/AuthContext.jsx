import React, { createContext, useState } from "react";

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

  const login = (tokenValue, name) => {
    setToken(tokenValue);
    setUser(name);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", name);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
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
