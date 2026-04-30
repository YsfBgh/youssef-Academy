import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import LessonView from './pages/LessonView'
import QuizPage from './pages/QuizPage'
import CodeLab from './pages/CodeLab'
import WorkflowPage from './pages/WorkflowPage'
import Simulations from './pages/Simulations'
import Roadmap from './pages/Roadmap'
import EnterpriseSim from './pages/EnterpriseSim'
import ProjectLab from './pages/ProjectLab'
import AIAgentsLab from './pages/AIAgentsLab'
import InterviewMode from './pages/InterviewMode'
import SkillTree from './pages/SkillTree'
import DailyMission from './pages/DailyMission'
import CareerOS from './pages/CareerOS'
import CodeReviewLab from './pages/CodeReviewLab'
import DebuggingLab from './pages/DebuggingLab'
import ArchitectureLab from './pages/ArchitectureLab'
import AuthPage from './pages/AuthPage'
import Leaderboard from './pages/Leaderboard'
import AICoach from './pages/AICoach'
import { useAuth } from './utils/AuthContext'
import { ProgressProvider } from './utils/ProgressContext'

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="glass-panel px-5 py-4 text-sm text-slate-300">
          Loading JaDev Academy...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <ProgressProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="career" element={<CareerOS />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="aicoach" element={<AICoach />} />
          <Route path="daily" element={<DailyMission />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:trackId/lesson/:lessonId" element={<LessonView />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="quiz/:trackId" element={<QuizPage />} />
          <Route path="codelab" element={<CodeLab />} />
          <Route path="codereview" element={<CodeReviewLab />} />
          <Route path="debugging" element={<DebuggingLab />} />
          <Route path="architecture" element={<ArchitectureLab />} />
          <Route path="workflows" element={<WorkflowPage />} />
          <Route path="simulations" element={<Simulations />} />
          <Route path="enterprise" element={<EnterpriseSim />} />
          <Route path="projects" element={<ProjectLab />} />
          <Route path="aiagents" element={<AIAgentsLab />} />
          <Route path="interview" element={<InterviewMode />} />
          <Route path="skilltree" element={<SkillTree />} />
        </Route>
      </Routes>
    </ProgressProvider>
  )
}
