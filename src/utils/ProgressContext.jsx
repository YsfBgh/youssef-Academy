import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TRACKS } from '../data/courses';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

const ProgressContext = createContext(null);

// ── Defensive normalizer — keeps corrupted DB data from crashing the app ──
function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const obj = (key) =>
    value[key] && typeof value[key] === 'object' && !Array.isArray(value[key]) ? value[key] : {};
  return {
    ...value,
    lessons:               obj('lessons'),
    quizzes:               obj('quizzes'),
    challenges:            obj('challenges'),
    missions:              obj('missions'),
    projects:              obj('projects'),
    interviews:            obj('interviews'),
    agentLessons:          obj('agentLessons'),
    agentSims:             obj('agentSims'),
    enterpriseMissions:    obj('enterpriseMissions'),
    skillNodes:            Array.isArray(value.skillNodes) ? value.skillNodes : [],
    dailyMissions:         obj('dailyMissions'),
    careerChecks:          obj('careerChecks'),
    seniorHabits:          obj('seniorHabits'),
    codeReviews:           obj('codeReviews'),
    debugScenarios:        obj('debugScenarios'),
    architectureScenarios: obj('architectureScenarios'),
    lastVisit:             typeof value.lastVisit === 'string' ? value.lastVisit : '',
    streak:                typeof value.streak === 'number'   ? value.streak   : 0,
  };
}

// ── XP calculator ──────────────────────────────────────────────────────────
function calculateXP(progress) {
  const lessonXP       = Object.keys(progress.lessons            ?? {}).length * 50;
  const quizXP         = Object.values(progress.quizzes          ?? {}).reduce((s, q) => s + Math.round((q.score ?? 0) * 1.5), 0);
  const challengeXP    = Object.keys(progress.challenges         ?? {}).length * 100;
  const missionXP      = Object.keys(progress.missions           ?? {}).length * 50;
  const projectXP      = Object.values(progress.projects         ?? {}).reduce((s, p) => s + (p.completedMilestones?.length ?? 0) * 100, 0);
  const interviewXP    = Object.keys(progress.interviews         ?? {}).length * 30;
  const agentLessonXP  = Object.keys(progress.agentLessons       ?? {}).length * 60;
  const agentSimXP     = Object.keys(progress.agentSims          ?? {}).length * 150;
  const enterpriseXP   = Object.values(progress.enterpriseMissions ?? {}).reduce((s, m) => s + (m.xpEarned ?? 0), 0);
  const dailyXP        = Object.keys(progress.dailyMissions      ?? {}).length * 100;
  const codeReviewXP   = Object.keys(progress.codeReviews        ?? {}).length * 80;
  const debugXP        = Object.keys(progress.debugScenarios     ?? {}).length * 90;
  const archXP         = Object.keys(progress.architectureScenarios ?? {}).length * 120;
  const habitXP        = Object.values(progress.seniorHabits     ?? {}).reduce(
    (s, day) => s + Object.keys(typeof day === 'object' ? day : {}).length * 15, 0
  );
  return lessonXP + quizXP + challengeXP + missionXP + projectXP + interviewXP
       + agentLessonXP + agentSimXP + enterpriseXP + dailyXP + codeReviewXP
       + debugXP + archXP + habitXP;
}

// ── Provider ───────────────────────────────────────────────────────────────
export function ProgressProvider({ children }) {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(normalizeProgress({}));
  const [saving, setSaving] = useState(false);

  // Load from Supabase on mount / user change
  useEffect(() => {
    if (!currentUser?.id) return;
    supabase
      .from('profiles')
      .select('progress')
      .eq('id', currentUser.id)
      .single()
      .then(({ data }) => {
        if (data?.progress) setProgress(normalizeProgress(data.progress));
      });
  }, [currentUser?.id]);

  // Persist to Supabase
  const persist = useCallback(async (updated) => {
    if (!currentUser?.id || saving) return;
    setSaving(true);
    const xp    = calculateXP(updated);
    const level = Math.floor(xp / 500) + 1;
    const total = calculateTotalProgressFromRaw(updated);
    await supabase.from('profiles').update({
      progress:        updated,
      xp,
      level,
      total_progress:  total,
      streak:          updated.streak ?? 0,
    }).eq('id', currentUser.id);
    setSaving(false);
  }, [currentUser?.id, saving]);

  const update = useCallback((fn) => {
    setProgress(prev => {
      const next = normalizeProgress(fn(prev));
      persist(next);
      return next;
    });
  }, [persist]);

  // ── Helpers ──────────────────────────────────────────────
  function calculateTotalProgressFromRaw(p) {
    const totalLessons = TRACKS.reduce((s, t) => s + t.lessons.length, 0);
    if (totalLessons === 0) return 0;
    const completed = Object.keys(p.lessons ?? {}).length;
    return Math.round((completed / totalLessons) * 100);
  }

  // Lessons
  const markLessonComplete = useCallback((trackId, lessonId) => {
    update(p => ({ ...p, lessons: { ...p.lessons, [`${trackId}:${lessonId}`]: { completedAt: Date.now() } } }));
  }, [update]);
  const isLessonComplete = useCallback((trackId, lessonId) =>
    !!progress.lessons?.[`${trackId}:${lessonId}`], [progress.lessons]);

  // Quizzes
  const markQuizComplete = useCallback((trackId, score) => {
    update(p => ({ ...p, quizzes: { ...p.quizzes, [trackId]: { score, completedAt: Date.now() } } }));
  }, [update]);
  const isQuizComplete = useCallback((trackId) =>
    !!progress.quizzes?.[trackId], [progress.quizzes]);

  // Challenges
  const markChallengeComplete = useCallback((challengeId) => {
    update(p => ({ ...p, challenges: { ...p.challenges, [challengeId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isChallengeComplete = useCallback((id) =>
    !!progress.challenges?.[id], [progress.challenges]);

  // Projects
  const markProjectMilestoneComplete = useCallback((projectId, milestoneId) => {
    update(p => {
      const existing = p.projects?.[projectId] ?? { completedMilestones: [] };
      const completedMilestones = Array.isArray(existing.completedMilestones) ? existing.completedMilestones : [];
      if (completedMilestones.includes(milestoneId)) return p;
      return { ...p, projects: { ...p.projects, [projectId]: { ...existing, completedMilestones: [...completedMilestones, milestoneId] } } };
    });
  }, [update]);
  const isProjectMilestoneComplete = useCallback((projectId, milestoneId) =>
    !!progress.projects?.[projectId]?.completedMilestones?.includes(milestoneId), [progress.projects]);
  const getProjectProgress = useCallback((projectId, totalMilestones) => {
    const completed = progress.projects?.[projectId]?.completedMilestones?.length ?? 0;
    return totalMilestones > 0 ? Math.round((completed / totalMilestones) * 100) : 0;
  }, [progress.projects]);

  // Interviews
  const markInterviewComplete = useCallback((questionId) => {
    update(p => ({ ...p, interviews: { ...p.interviews, [questionId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isInterviewComplete = useCallback((questionId) =>
    !!progress.interviews?.[questionId], [progress.interviews]);

  // AI Agents
  const markAgentLessonComplete = useCallback((lessonId) => {
    update(p => ({ ...p, agentLessons: { ...p.agentLessons, [lessonId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isAgentLessonComplete = useCallback((lessonId) =>
    !!progress.agentLessons?.[lessonId], [progress.agentLessons]);
  const markAgentSimComplete = useCallback((simId) => {
    update(p => ({ ...p, agentSims: { ...p.agentSims, [simId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isAgentSimComplete = useCallback((simId) =>
    !!progress.agentSims?.[simId], [progress.agentSims]);

  // Enterprise
  const markEnterpriseMissionComplete = useCallback((missionId, xpEarned = 0) => {
    update(p => ({ ...p, enterpriseMissions: { ...p.enterpriseMissions, [missionId]: { completedAt: Date.now(), xpEarned } } }));
  }, [update]);
  const isEnterpriseMissionComplete = useCallback((id) =>
    !!progress.enterpriseMissions?.[id], [progress.enterpriseMissions]);

  // Daily missions
  const markDailyMissionComplete = useCallback((dateString, key) => {
    update(p => {
      const day = { ...(p.dailyMissions?.[dateString] ?? {}), [key]: true };
      if (day.lesson && day.quiz && day.challenge && day.workflow) {
        day.bonusAwarded = true;
      }
      return { ...p, dailyMissions: { ...p.dailyMissions, [dateString]: day } };
    });
  }, [update]);
  const getDailyMissionProgress = useCallback((dateString) =>
    progress.dailyMissions?.[dateString] ?? {}, [progress.dailyMissions]);

  // Code review
  const markCodeReviewComplete = useCallback((caseId) => {
    update(p => ({ ...p, codeReviews: { ...p.codeReviews, [caseId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isCodeReviewComplete = useCallback((id) =>
    !!progress.codeReviews?.[id], [progress.codeReviews]);

  // Debug
  const markDebugScenarioComplete = useCallback((scenarioId) => {
    update(p => ({ ...p, debugScenarios: { ...p.debugScenarios, [scenarioId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isDebugScenarioComplete = useCallback((id) =>
    !!progress.debugScenarios?.[id], [progress.debugScenarios]);

  // Architecture
  const markArchitectureScenarioComplete = useCallback((scenarioId) => {
    update(p => ({ ...p, architectureScenarios: { ...p.architectureScenarios, [scenarioId]: { completedAt: Date.now() } } }));
  }, [update]);
  const isArchitectureScenarioComplete = useCallback((id) =>
    !!progress.architectureScenarios?.[id], [progress.architectureScenarios]);

  // Skill tree
  const unlockSkillNode = useCallback((nodeId) => {
    update(p => {
      if ((p.skillNodes ?? []).includes(nodeId)) return p;
      return { ...p, skillNodes: [...(p.skillNodes ?? []), nodeId] };
    });
  }, [update]);
  const isSkillNodeUnlocked = useCallback((id) =>
    (progress.skillNodes ?? []).includes(id), [progress.skillNodes]);

  // Career checks / senior habits
  const toggleCareerCheck = useCallback((listId, itemIndex) => {
    update(p => {
      const existing = Array.isArray(p.careerChecks?.[listId]) ? p.careerChecks[listId] : [];
      const nextList = existing.includes(itemIndex)
        ? existing.filter(i => i !== itemIndex)
        : [...existing, itemIndex];
      return { ...p, careerChecks: { ...p.careerChecks, [listId]: nextList } };
    });
  }, [update]);
  const isCareerCheckComplete = useCallback((listId, itemIndex) =>
    Array.isArray(progress.careerChecks?.[listId]) && progress.careerChecks[listId].includes(itemIndex),
  [progress.careerChecks]);

  const toggleSeniorHabit = useCallback((dateString, habitId) => {
    update(p => {
      const day = { ...(p.seniorHabits?.[dateString] ?? {}) };
      if (day[habitId]) {
        delete day[habitId];
      } else {
        day[habitId] = true;
      }
      return { ...p, seniorHabits: { ...p.seniorHabits, [dateString]: day } };
    });
  }, [update]);
  const isSeniorHabitDone = useCallback((dateString, habitId) =>
    !!progress.seniorHabits?.[dateString]?.[habitId], [progress.seniorHabits]);

  const markCareerCheck = useCallback((checkId) => {
    update(p => ({ ...p, careerChecks: { ...p.careerChecks, [checkId]: { completedAt: Date.now() } } }));
  }, [update]);
  const markSeniorHabit = useCallback((date, habitKey) => {
    update(p => ({ ...p, seniorHabits: { ...p.seniorHabits, [date]: { ...(p.seniorHabits?.[date] ?? {}), [habitKey]: true } } }));
  }, [update]);

  // ── Computed values ───────────────────────────────────────
  const getTotalProgress = useCallback(() => {
    return calculateTotalProgressFromRaw(progress);
  }, [progress]);

  const getTrackProgress = useCallback((trackId) => {
    const track = TRACKS.find(t => t.id === trackId);
    if (!track || track.lessons.length === 0) return 0;
    const completed = track.lessons.filter(l => progress.lessons?.[`${trackId}:${l.id}`]).length;
    return Math.round((completed / track.lessons.length) * 100);
  }, [progress]);

  const getXP = useCallback(() => calculateXP(progress), [progress]);
  const getStreak = useCallback(() => progress.streak ?? 0, [progress]);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (progress.lastVisit === today) return;
    update(p => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = p.lastVisit === yesterday ? (p.streak ?? 0) + 1 : 1;
      return { ...p, lastVisit: today, streak };
    });
  }, [progress, update]);

  const resetProgress = useCallback(() => {
    update(() => normalizeProgress({}));
  }, [update]);

  const value = {
    progress,
    saving,
    // Lessons
    markLessonComplete, isLessonComplete,
    // Quizzes
    markQuizComplete, isQuizComplete,
    // Challenges
    markChallengeComplete, isChallengeComplete,
    // Projects
    markProjectMilestoneComplete, isProjectMilestoneComplete, getProjectProgress,
    // Interview
    markInterviewComplete, isInterviewComplete,
    // AI Agents
    markAgentLessonComplete, isAgentLessonComplete,
    markAgentSimComplete, isAgentSimComplete,
    // Enterprise
    markEnterpriseMissionComplete, isEnterpriseMissionComplete,
    // Daily
    markDailyMissionComplete, getDailyMissionProgress,
    // Labs
    markCodeReviewComplete, isCodeReviewComplete,
    markDebugScenarioComplete, isDebugScenarioComplete,
    markArchitectureScenarioComplete, isArchitectureScenarioComplete,
    // Skill tree
    unlockSkillNode, isSkillNodeUnlocked,
    // Career
    toggleCareerCheck, isCareerCheckComplete,
    toggleSeniorHabit, isSeniorHabitDone,
    markCareerCheck, markSeniorHabit,
    // Computed
    getTotalProgress, getTrackProgress, getXP, getStreak,
    updateStreak, resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
