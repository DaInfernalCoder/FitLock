import { Session, User, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase, AUTH_EVENTS } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  options?: {
    data?: Record<string, any>;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

class SupabaseAuthService {
  private static instance: SupabaseAuthService;
  private initialized = false;
  private authStateListeners: ((state: AuthState) => void)[] = [];

  private constructor() {}

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Set up auth state listener
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('[Supabase] Auth state changed:', event);
        
        const authState: AuthState = {
          user: session?.user || null,
          session: session,
          loading: false,
        };

        // Notify all listeners
        this.authStateListeners.forEach(listener => listener(authState));

        // Handle specific events
        switch (event) {
          case 'SIGNED_IN':
            this.handleSignIn(session);
            break;
          case 'SIGNED_OUT':
            this.handleSignOut();
            break;
          case 'TOKEN_REFRESHED':
            this.handleTokenRefresh(session);
            break;
        }
      });

      this.initialized = true;
      console.log('[Supabase] Auth service initialized successfully');
    } catch (error) {
      console.error('[Supabase] Initialization failed:', error);
      throw error;
    }
  }

  // Auth state management
  addAuthStateListener(listener: (state: AuthState) => void): () => void {
    this.authStateListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Authentication methods
  async signUp({ email, password, options }: SignUpData): Promise<AuthResponse> {
    try {
      console.log('[Supabase] Attempting sign up for:', email);
      const result = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (result.error) {
        console.error('[Supabase] Sign up error:', result.error.message);
      } else {
        console.log('[Supabase] Sign up successful');
      }

      return result;
    } catch (error) {
      console.error('[Supabase] Sign up failed:', error);
      throw error;
    }
  }

  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      console.log('[Supabase] Attempting sign in for:', email);
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        console.error('[Supabase] Sign in error:', result.error.message);
      } else {
        console.log('[Supabase] Sign in successful');
      }

      return result;
    } catch (error) {
      console.error('[Supabase] Sign in failed:', error);
      throw error;
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      console.log('[Supabase] Attempting sign out');
      const result = await supabase.auth.signOut();

      if (result.error) {
        console.error('[Supabase] Sign out error:', result.error.message);
      } else {
        console.log('[Supabase] Sign out successful');
      }

      return result;
    } catch (error) {
      console.error('[Supabase] Sign out failed:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      console.log('[Supabase] Requesting password reset for:', email);
      const result = await supabase.auth.resetPasswordForEmail(email);

      if (result.error) {
        console.error('[Supabase] Password reset error:', result.error.message);
      } else {
        console.log('[Supabase] Password reset email sent');
      }

      return result;
    } catch (error) {
      console.error('[Supabase] Password reset failed:', error);
      throw error;
    }
  }

  // Session management
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[Supabase] Failed to get current session:', error.message);
        return null;
      }

      return session;
    } catch (error) {
      console.error('[Supabase] Get session failed:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session means no user - this is normal, not an error
        return null;
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('[Supabase] Failed to get current user:', error.message);
        return null;
      }

      return user;
    } catch (error) {
      console.error('[Supabase] Get user failed:', error);
      return null;
    }
  }

  // Private event handlers
  private async handleSignIn(session: Session | null): Promise<void> {
    if (session) {
      console.log('[Supabase] User signed in:', session.user.email);
      // Store session in AsyncStorage for persistence
      await AsyncStorage.setItem('supabase.auth.session', JSON.stringify(session));
    }
  }

  private async handleSignOut(): Promise<void> {
    console.log('[Supabase] User signed out');
    // Clear session from AsyncStorage
    await AsyncStorage.removeItem('supabase.auth.session');
  }

  private async handleTokenRefresh(session: Session | null): Promise<void> {
    if (session) {
      console.log('[Supabase] Token refreshed for user:', session.user.email);
      // Update session in AsyncStorage
      await AsyncStorage.setItem('supabase.auth.session', JSON.stringify(session));
    }
  }
}

export const supabaseAuthService = SupabaseAuthService.getInstance(); 