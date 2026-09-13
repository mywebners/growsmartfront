import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import EducationLevel from "./pages/EducationLevel";
import StreamSelection from "./pages/StreamSelection";
import MatricSubjects from "./pages/MatricSubjects";
import IntermediateStream from "./pages/IntermediateStream";
import IntermediateSubjects from "./pages/IntermediateSubjects";
import SkillsTest from "./pages/SkillsTest";
import Result from "./pages/Result";

import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import CareerInsights from "./pages/CareerInsights";
import GuidanceHub from "./pages/GuidanceHub";
import StudyGoal from "./pages/StudyGoal";
import StudyResult from "./pages/StudyResult";
import JobsGuidance from "./pages/JobsGuidance";
import CareerScope from "./pages/CareerScope";
import JobsBachelor from "./pages/JobsBachelor";
import JobsResult from "./pages/JobsResult";

import Scene3D from './components/3DCanvas';
import LoadingSpinner from "./components/LoadingSpinner";

function AppLayout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/guidance" element={
          <ProtectedRoute><GuidanceHub /></ProtectedRoute>
        } />
        <Route path="/study/goal" element={
          <ProtectedRoute><StudyGoal /></ProtectedRoute>
        } />
        <Route path="/study/result" element={
          <ProtectedRoute><StudyResult /></ProtectedRoute>
        } />
        <Route path="/jobs-guidance" element={
          <ProtectedRoute><JobsGuidance /></ProtectedRoute>
        } />
        <Route path="/jobs/bachelor" element={
          <ProtectedRoute><JobsBachelor /></ProtectedRoute>
        } />
        <Route path="/jobs/result" element={
          <ProtectedRoute><JobsResult /></ProtectedRoute>
        } />

        <Route path="/education" element={
          <ProtectedRoute><EducationLevel /></ProtectedRoute>
        } />

        <Route path="/stream" element={
          <ProtectedRoute><StreamSelection /></ProtectedRoute>
        } />

        <Route path="/matric-subjects" element={
          <ProtectedRoute><MatricSubjects /></ProtectedRoute>
        } />

        <Route path="/intermediate-stream" element={
          <ProtectedRoute><IntermediateStream /></ProtectedRoute>
        } />

        <Route path="/intermediate-subjects" element={
          <ProtectedRoute><IntermediateSubjects /></ProtectedRoute>
        } />

        <Route path="/skills" element={
          <ProtectedRoute><SkillsTest /></ProtectedRoute>
        } />

        <Route path="/result" element={
          <ProtectedRoute><Result /></ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/history/:id" element={
          <ProtectedRoute><HistoryDetail /></ProtectedRoute>
        } />
        <Route path="/career-insights" element={
          <ProtectedRoute><CareerInsights /></ProtectedRoute>
        } />
        <Route path="/career-scope" element={
          <ProtectedRoute><CareerScope /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Scene3D />
      <div className="relative z-10 min-h-screen page-shell">
        <AuthProvider>
          <Router>
            <AppLayout />
          </Router>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;