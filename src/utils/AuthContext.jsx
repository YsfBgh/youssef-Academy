import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const AuthContext = createContext(null);

function profileFromRow(row, fallbackUser = null) {
  if (!row && !fallbackUser) return null;

  return {
    id: row?.id ?? fallbackUser?.id,
    name: row?.name ?? fallbackUser?.user_metadata?.name ?? fallbackUser?.email?.split('@')[0] ?? 'Developer',
    email: row?.email ?? fallbackUser?.email ?? '',
    progress: row?.progress ?? {},
    stats: {
      xp: row?.xp ?? 0,
      level: row?.level ?? 1,
      totalProgress: row?.total_progress ?? 0,
      streak: row?.streak ?? 1,
      updatedAt: row?.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
    },
  };
}

async function fetchProfile(user) {
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    return profileFromRow(data, user);
  }

  const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Developer';
  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      name,
      email: user.email,
      progress: {},
      xp: 0,
      level: 1,
      total_progress: 0,
      streak: 1,
    })
    .select('*')
    .single();

  if (insertError) throw insertError;
  return profileFromRow(inserted, user);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const loadLeaderboard = useCallback(async () => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,email,xp,level,total_progress,streak,updated_at')
      .order('xp', { ascending: false });

    if (error) throw error;

    const rows = (data ?? []).map(row => profileFromRow(row));
    setLeaderboard(rows);
    return rows;
  }, []);

  const loadCurrentProfile = useCallback(async (authSession) => {
    if (!supabase || !authSession?.user) {
      setCurrentUser(null);
      return null;
    }

    const profile = await fetchProfile(authSession.user);
    setCurrentUser(profile);
    await loadLeaderboard();
    return profile;
  }, [loadLeaderboard]);

  useEffect(() => {
    let active = true;

    async function init() {
      if (!isSupabaseConfigured || !supabase) {
        setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!active) return;

        setSession(data.session);
        await loadCurrentProfile(data.session);
      } catch (err) {
        if (active) setAuthError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    init();

    if (!supabase) return undefined;

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setCurrentUser(null);
        return;
      }
      loadCurrentProfile(nextSession).catch(err => setAuthError(err.message));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadCurrentProfile]);

  const register = useCallback(async ({ name, email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !cleanEmail || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { name: cleanName },
      },
    });

    if (error) throw error;

    if (!data.session) {
      return { needsConfirmation: true };
    }

    const profile = await fetchProfile(data.user);
    setCurrentUser(profile);
    await loadLeaderboard();
    return { needsConfirmation: false };
  }, [loadLeaderboard]);

  const login = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) throw error;

    setSession(data.session);
    await loadCurrentProfile(data.session);
  }, [loadCurrentProfile]);

  const logout = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setCurrentUser(null);
  }, []);

  const updateStats = useCallback(async ({ progress, xp, level, totalProgress, streak }) => {
    if (!supabase || !session?.user?.id) return;

    const update = {
      xp,
      level,
      total_progress: totalProgress,
      streak,
      updated_at: new Date().toISOString(),
    };

    if (progress) {
      update.progress = progress;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', session.user.id)
      .select('*')
      .single();

    if (error) throw error;

    const nextUser = profileFromRow(data, session.user);
    setCurrentUser(nextUser);
    await loadLeaderboard();
  }, [loadLeaderboard, session?.user]);

  const value = useMemo(() => ({
    session,
    currentUser,
    leaderboard,
    loading,
    authError,
    register,
    login,
    logout,
    updateStats,
    refreshLeaderboard: loadLeaderboard,
    isDatabaseConfigured: isSupabaseConfigured,
  }), [
    session,
    currentUser,
    leaderboard,
    loading,
    authError,
    register,
    login,
    logout,
    updateStats,
    loadLeaderboard,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
