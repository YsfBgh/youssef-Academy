import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TRACKS } from '../data/courses';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return {
    ...value,
    lessons: value.lessons && typeof value.lessons === 'object' && !Array.isArray(value.lessons)
      ? value.lessons : {},
    quizzes: value.quizzes && typeof value.quizzes === 'object' && !Array.isArray(value.quizzes)
      ? value.quizzes : {},
    challenges: value.challenges && typeof value.challenges === 'object' && !Array.isArray(value.challenges)
      ? value.challenges : {},
    missions: value.missions && typeof value.missions === 'object' && !Array.isArray(value.missions)
      ? value.missions : {},
    projects: value.projects && typeof value.projects === 'object' && !Array.isArray(value.projects)
      ? value.projects : {},
    interviews: value.interviews && typeof value.interviews === 'object' && !Array.isArray(value.interviews)
      ? value.interviews : {},
    agentLessons: value.agentLessons && typeof value.agentLessons === 'object' && !Array.isArray(value.agentLessons)
      ? value.agentLessons : {},
    agentSims: value.agentSims && typeof value.agentSims === 'object' && !Array.isArray(value.agentSims)
      ? value.agentSims : {},
    enterpriseMissions: value.enterpriseMissions && typeof value.enterpriseMissions === 'object' && !Array.isArray(value.enterpriseMissions)
      ? value.enterpriseMissions : {},
    skillNodes: value.skillNodes && Array.isArray(value.skillNodes)
      ? value.skillNodes : [],
    dailyMissions: value.dailyMissions && typeof value.dailyMissions === 'object' && !Array.isArray(value.dailyMissions)
      ? value.dailyMissions : {},
    careerChecks: value.careerChecks && typeof value.careerChecks === 'object' && !Array.isArray(value.careerChecks)
      ? value.careerChecks : {},
    seniorHabits: value.seniorHabits && typeof value.seniorHabits === 'object' && !Array.isArray(value.seniorHabits)
      ? value.seniorHabits : {},
    codeReviews: value.codeReviews && typeof value.codeReviews === 'object' && !Array.isArray(value.codeReviews)
      ? value.codeReviews : {},
    debugScenarios: value.debugScenarios && typeof value.debugScenarios === 'object' && !Array.isArray(value.debugScenarios)
      ? value.debugScenarios : {},
    architectureScenarios: value.architectureScenarios && typeof value.architectureScenarios === 'object' && !Array.isArray(value.architectureScenarios)
      ? value.architectureScenarios : {},
  };
}

function calculateXP(progress) {
  const lessonXP = Object.keys(progress.lessons ?? {}).length * 50;
  const quizXP = Object.values(progress.quizzes ?? {}).reduce((s, q) => s + Math.round(q.score * 1.5), 0);
  const challengeXP = Object.keys(progress.challenges ?? {}).length * 100;
  const missionXP = Object.keys(progress.missions ?? {}).length * 50;
  const projectMilestoneXP = Object.values(progress.projects ?? {}).reduce((s, p) => s + (p.completedMilestones?.length ?? 0) * 100, 0);
  const interviewXP = Object.keys(progress.interviews ?? {}).length * 30;
  const agentLessonXP = Object.keys(progress.agentLessons ?? {}).length * 60;
  const agentSimXP = Object.keys(progress.agentSims ?? {}).length * 150;
  const enterpriseXP = Object.values(progress.enterpriseMissions ?? {}).reduce((s, m) => s + (m.xpEarned ?? 0), 0);
  const dailyBonusXP = Object.keys(progress.dailyMissions ?? {}).length * 100;
  const codeReviewXP = Object.keys(progress.codeReviews ?? {}).length * 80;
  const debugXP = Object.keys(progress.debugScenarios ?? {}).length * 90;
  const architectureXP = Object.keys(progress.architectureScenarios ?? {}).length * 120;
  const seniorHabitXP = Object.values(progress.seniorHabits ?? {}).reduce((s, value) => s + Object.keys(value ?? {}).length * 15, 0);
  return lessonXP + quizXP + challengeXP + missionXP + projectMilestoneXP +
    interviewXP + agentLessonXP + agentSimXP + enterpriseXP + dailyBonusXP +
    codeReviewXP + debugXP + architectureXP + seniorHabitXP;
}

function calculateTotalProgress(progress) {
  const totalLessons = TRACKS.reduce((s, t) => s + t.lessons.length, 0);
  const completedLessons = Object.keys(progress.lessons ?? {}).length;
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
}

export function ProgressProvider({ children }) {
  const { currentUser, updateStats } = useAuth();
  const [progress, setProgress] = useState(() => normalizeProgress(currentUser?.progress));

  useEffect(() => {
    setProgress(normalizeProgress(currentUser?.progress));
  }, [currentUser?.id, currentUser?.progress]);

  const save = useCallback((next) => {
    const normalized = normalizeProgress(next);
    setProgress(normalized);
    const xp = calculateXP(normalized);
    updateStats({
      progress: normalized,
      xp,
      level: Math.floor(xp / 500) + 1,
      totalProgress: calculateTotalProgress(normalized),
      streak: normalized.streak ?? 1,
    }).catch(err => {
      console.error('Failed to save progress to database', err);
    });
  }, [updateStats]);

  // ─── Original helpers ────────────────────────────────────────
  const markLessonComplete = useCallback((trackId, lessonId) => {
    const next = { ...progress };
    if (!next.lessons) next.lessons = {};
    next.lessons[`${trackId}:${lessonId}`] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const markQuizComplete = useCallback((trackId, score) => {
    const next = { ...progress };
    if (!next.quizzes) next.quizzes = {};
    const prev = next.quizzes[trackId];
    if (!prev || score > (prev.score ?? 0)) {
      next.quizzes[trackId] = { score, completedAt: Date.now() };
    }
    save(next);
  }, [progress, save]);

  const markChallengeComplete = useCallback((challengeId) => {
    const next = { ...progress };
    if (!next.challenges) next.challenges = {};
    next.challenges[challengeId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isLessonComplete = useCallback((trackId, lessonId) =>
    !!(progress.lessons?.[`${trackId}:${lessonId}`]),
  [progress]);

  const isQuizComplete = useCallback((trackId) =>
    !!(progress.quizzes?.[trackId]),
  [progress]);

  const isChallengeComplete = useCallback((id) =>
    !!(progress.challenges?.[id]),
  [progress]);

  const getTrackProgress = useCallback((trackId) => {
    const track = TRACKS.find(t => t.id === trackId);
    if (!track) return 0;
    const completed = track.lessons.filter(l => isLessonComplete(trackId, l.id)).length;
    return Math.round((completed / track.lessons.length) * 100);
  }, [isLessonComplete]);

  const getTotalProgress = useCallback(() => {
    return calculateTotalProgress(progress);
  }, [progress]);

  const getXP = useCallback(() => {
    return calculateXP(progress);
  }, [progress]);

  const getStreak = useCallback(() => {
    const today = new Date().toDateString();
    return progress.lastVisit === today ? (progress.streak ?? 1) : 1;
  }, [progress]);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    if (progress.lastVisit === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = progress.lastVisit === yesterday ? (progress.streak ?? 0) + 1 : 1;
    save({ ...progress, lastVisit: today, streak: newStreak });
  }, [progress, save]);

  const resetProgress = useCallback(() => {
    save({});
  }, [save]);

  // ─── New helpers ─────────────────────────────────────────────

  const markEnterpriseMissionComplete = useCallback((missionId, xpEarned) => {
    const next = { ...progress };
    if (!next.enterpriseMissions) next.enterpriseMissions = {};
    next.enterpriseMissions[missionId] = { completedAt: Date.now(), xpEarned };
    save(next);
  }, [progress, save]);

  const isEnterpriseMissionComplete = useCallback((missionId) =>
    !!(progress.enterpriseMissions?.[missionId]),
  [progress]);

  const markProjectMilestoneComplete = useCallback((projectId, milestoneId) => {
    const next = { ...progress };
    if (!next.projects) next.projects = {};
    if (!next.projects[projectId]) next.projects[projectId] = { completedMilestones: [] };
    const existing = next.projects[projectId].completedMilestones ?? [];
    if (!existing.includes(milestoneId)) {
      next.projects[projectId].completedMilestones = [...existing, milestoneId];
    }
    save(next);
  }, [progress, save]);

  const isProjectMilestoneComplete = useCallback((projectId, milestoneId) =>
    !!(progress.projects?.[projectId]?.completedMilestones?.includes(milestoneId)),
  [progress]);

  const getProjectProgress = useCallback((projectId, totalMilestones) => {
    const completed = progress.projects?.[projectId]?.completedMilestones?.length ?? 0;
    return totalMilestones > 0 ? Math.round((completed / totalMilestones) * 100) : 0;
  }, [progress]);

  const markInterviewComplete = useCallback((questionId) => {
    const next = { ...progress };
    if (!next.interviews) next.interviews = {};
    next.interviews[questionId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isInterviewComplete = useCallback((questionId) =>
    !!(progress.interviews?.[questionId]),
  [progress]);

  const markAgentLessonComplete = useCallback((lessonId) => {
    const next = { ...progress };
    if (!next.agentLessons) next.agentLessons = {};
    next.agentLessons[lessonId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isAgentLessonComplete = useCallback((lessonId) =>
    !!(progress.agentLessons?.[lessonId]),
  [progress]);

  const markAgentSimComplete = useCallback((simId) => {
    const next = { ...progress };
    if (!next.agentSims) next.agentSims = {};
    next.agentSims[simId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isAgentSimComplete = useCallback((simId) =>
    !!(progress.agentSims?.[simId]),
  [progress]);

  const unlockSkillNode = useCallback((nodeId) => {
    const next = { ...progress };
    if (!next.skillNodes) next.skillNodes = [];
    if (!next.skillNodes.includes(nodeId)) {
      next.skillNodes = [...next.skillNodes, nodeId];
    }
    save(next);
  }, [progress, save]);

  const isSkillNodeUnlocked = useCallback((nodeId) =>
    progress.skillNodes?.includes(nodeId) ?? false,
  [progress]);

  const markDailyMissionComplete = useCallback((dateString, key) => {
    const next = { ...progress };
    if (!next.dailyMissions) next.dailyMissions = {};
    if (!next.dailyMissions[dateString]) next.dailyMissions[dateString] = {};
    next.dailyMissions[dateString][key] = true;
    // Check if all 4 tasks done → award bonus
    const tasks = next.dailyMissions[dateString];
    if (tasks.lesson && tasks.quiz && tasks.challenge && tasks.workflow) {
      next.dailyMissions[dateString].bonusAwarded = true;
    }
    save(next);
  }, [progress, save]);

  const getDailyMissionProgress = useCallback((dateString) => {
    return progress.dailyMissions?.[dateString] ?? {};
  }, [progress]);

  const toggleCareerCheck = useCallback((listId, itemIndex) => {
    const next = { ...progress };
    if (!next.careerChecks) next.careerChecks = {};
    if (!next.careerChecks[listId]) next.careerChecks[listId] = [];
    const existing = next.careerChecks[listId];
    next.careerChecks[listId] = existing.includes(itemIndex)
      ? existing.filter(i => i !== itemIndex)
      : [...existing, itemIndex];
    save(next);
  }, [progress, save]);

  const isCareerCheckComplete = useCallback((listId, itemIndex) =>
    !!(progress.careerChecks?.[listId]?.includes(itemIndex)),
  [progress]);

  const toggleSeniorHabit = useCallback((dateString, habitId) => {
    const next = { ...progress };
    if (!next.seniorHabits) next.seniorHabits = {};
    if (!next.seniorHabits[dateString]) next.seniorHabits[dateString] = {};
    next.seniorHabits[dateString][habitId] = !next.seniorHabits[dateString][habitId];
    if (!next.seniorHabits[dateString][habitId]) {
      delete next.seniorHabits[dateString][habitId];
    }
    save(next);
  }, [progress, save]);

  const isSeniorHabitDone = useCallback((dateString, habitId) =>
    !!(progress.seniorHabits?.[dateString]?.[habitId]),
  [progress]);

  const markCodeReviewComplete = useCallback((caseId) => {
    const next = { ...progress };
    if (!next.codeReviews) next.codeReviews = {};
    next.codeReviews[caseId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isCodeReviewComplete = useCallback((caseId) =>
    !!(progress.codeReviews?.[caseId]),
  [progress]);

  const markDebugScenarioComplete = useCallback((scenarioId) => {
    const next = { ...progress };
    if (!next.debugScenarios) next.debugScenarios = {};
    next.debugScenarios[scenarioId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isDebugScenarioComplete = useCallback((scenarioId) =>
    !!(progress.debugScenarios?.[scenarioId]),
  [progress]);

  const markArchitectureScenarioComplete = useCallback((scenarioId) => {
    const next = { ...progress };
    if (!next.architectureScenarios) next.architectureScenarios = {};
    next.architectureScenarios[scenarioId] = { completedAt: Date.now() };
    save(next);
  }, [progress, save]);

  const isArchitectureScenarioComplete = useCallback((scenarioId) =>
    !!(progress.architectureScenarios?.[scenarioId]),
  [progress]);

  return (
    <ProgressContext.Provider value={{
      progress,
      // Original
      markLessonComplete,
      markQuizComplete,
      markChallengeComplete,
      isLessonComplete,
      isQuizComplete,
      isChallengeComplete,
      getTrackProgress,
      getTotalProgress,
      getXP,
      getStreak,
      updateStreak,
      resetProgress,
      // New
      markEnterpriseMissionComplete,
      isEnterpriseMissionComplete,
      markProjectMilestoneComplete,
      isProjectMilestoneComplete,
      getProjectProgress,
      markInterviewComplete,
      isInterviewComplete,
      markAgentLessonComplete,
      isAgentLessonComplete,
      markAgentSimComplete,
      isAgentSimComplete,
      unlockSkillNode,
      isSkillNodeUnlocked,
      markDailyMissionComplete,
      getDailyMissionProgress,
      toggleCareerCheck,
      isCareerCheckComplete,
      toggleSeniorHabit,
      isSeniorHabitDone,
      markCodeReviewComplete,
      isCodeReviewComplete,
      markDebugScenarioComplete,
      isDebugScenarioComplete,
      markArchitectureScenarioComplete,
      isArchitectureScenarioComplete,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider');
  return ctx;
}
