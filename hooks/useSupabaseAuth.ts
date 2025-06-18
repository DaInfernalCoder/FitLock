import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAuthService, AuthState, SignUpData, SignInData } from '../services/supabase';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize the auth service
      await supabaseAuthService.initialize();
      
      // Get current session
      const currentSession = await supabaseAuthService.getCurrentSession();
      
      // If we have a session, the user is available in the session
      // No need to make a separate getCurrentUser call
      const currentUser = currentSession?.user || null;
      
      setSession(currentSession);
      setUser(currentUser);
      setInitialized(true);

      // Set up auth state listener
      const unsubscribe = supabaseAuthService.addAuthStateListener((authState: AuthState) => {
        setUser(authState.user);
        setSession(authState.session);
        setLoading(authState.loading);
      });

      // Cleanup function
      return unsubscribe;
    } catch (error) {
      console.error('[Supabase] Hook initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = useCallback(async (data: SignUpData) => {
    setLoading(true);
    try {
      const result = await supabaseAuthService.signUp(data);
      return result;
    } catch (error) {
      console.error('[Supabase] Hook sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data: SignInData) => {
    setLoading(true);
    try {
      const result = await supabaseAuthService.signIn(data);
      return result;
    } catch (error) {
      console.error('[Supabase] Hook sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const result = await supabaseAuthService.signOut();
      return result;
    } catch (error) {
      console.error('[Supabase] Hook sign out failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const result = await supabaseAuthService.resetPassword(email);
      return result;
    } catch (error) {
      console.error('[Supabase] Hook password reset failed:', error);
      throw error;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const currentSession = await supabaseAuthService.getCurrentSession();
      const currentUser = currentSession?.user || null;
      
      setSession(currentSession);
      setUser(currentUser);
      
      return { session: currentSession, user: currentUser };
    } catch (error) {
      console.error('[Supabase] Hook session refresh failed:', error);
      throw error;
    }
  }, []);

  return {
    // State
    user,
    session,
    loading,
    initialized,
    
    // Computed state
    isAuthenticated: !!user && !!session,
    isEmailConfirmed: user?.email_confirmed_at != null,
    
    // Methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshSession,
  };
} 