import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const AuthContext = createContext(null);
const CURRENT_PROFILE_KEY = 'jadev_current_profile_id';

function normalizeUsername(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

async function hashPassword(username, password) {
  const input = `jadev-academy:${normalizeUsername(username)}:${password}`;
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function profileFromRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name ?? 'Developer',
    username: row.username ?? 'developer',
    email: row.email ?? '',
    progress: row.progress ?? {},
    stats: {
      xp: row.xp ?? 0,
      level: row.level ?? 1,
      totalProgress: row.total_progress ?? 0,
      streak: row.streak ?? 1,
      updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
    },
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const loadLeaderboard = useCallback(async () => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,username,email,xp,level,total_progress,streak,updated_at')
      .order('xp', { ascending: false });

    if (error) throw error;

    const rows = (data ?? []).map(row => profileFromRow(row));
    setLeaderboard(rows);
    return rows;
  }, []);

  const loadProfile = useCallback(async (profileId) => {
    if (!supabase || !profileId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,username,email,progress,xp,level,total_progress,streak,updated_at')
      .eq('id', profileId)
      .maybeSingle();

    if (error) throw error;

    const profile = profileFromRow(data);
    setCurrentUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      if (!isSupabaseConfigured || !supabase) {
        setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        setLoading(false);
        return;
      }

      try {
        const savedProfileId = localStorage.getItem(CURRENT_PROFILE_KEY);
        if (savedProfileId) {
          await loadProfile(savedProfileId);
        }
        await loadLeaderboard();
      } catch (err) {
        if (active) {
          localStorage.removeItem(CURRENT_PROFILE_KEY);
          setCurrentUser(null);
          setAuthError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    init();

    return () => {
      active = false;
    };
  }, [loadLeaderboard, loadProfile]);

  const register = useCallback(async ({ name, username, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    const cleanName = name.trim();
    const cleanUsername = normalizeUsername(username);
    if (!cleanName || !cleanUsername || !password) {
      throw new Error('Name, username, and password are required.');
    }
    if (cleanUsername.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const passwordHash = await hashPassword(cleanUsername, password);
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        name: cleanName,
        username: cleanUsername,
        email: `${cleanUsername}@jadev.local`,
        password_hash: passwordHash,
        progress: {},
        xp: 0,
        level: 1,
        total_progress: 0,
        streak: 1,
      })
      .select('id,name,username,email,progress,xp,level,total_progress,streak,updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('This username is already taken.');
      }
      throw error;
    }

    const profile = profileFromRow(data);
    localStorage.setItem(CURRENT_PROFILE_KEY, profile.id);
    setCurrentUser(profile);
    await loadLeaderboard();
    return { ok: true };
  }, [loadLeaderboard]);

  const login = useCallback(async ({ username, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    const cleanUsername = normalizeUsername(username);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Invalid username or password.');

    const passwordHash = await hashPassword(cleanUsername, password);
    if (data.password_hash !== passwordHash) {
      throw new Error('Invalid username or password.');
    }

    const profile = profileFromRow(data);
    localStorage.setItem(CURRENT_PROFILE_KEY, profile.id);
    setCurrentUser(profile);
    await loadLeaderboard();
  }, [loadLeaderboard]);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_PROFILE_KEY);
    setCurrentUser(null);
  }, []);

  const updateStats = useCallback(async ({ progress, xp, level, totalProgress, streak }) => {
    if (!supabase || !currentUser?.id) return;

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
      .eq('id', currentUser.id)
      .select('id,name,username,email,progress,xp,level,total_progress,streak,updated_at')
      .single();

    if (error) throw error;

    const nextUser = profileFromRow(data);
    setCurrentUser(nextUser);
    await loadLeaderboard();
  }, [currentUser?.id, loadLeaderboard]);

  const value = useMemo(() => ({
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
