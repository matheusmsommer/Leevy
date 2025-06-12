
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo users configuration
const DEMO_USERS = {
  'super@teste.com': { role: 'superadmin' as UserRole, name: 'Super Admin Demo' },
  'admin@teste.com': { role: 'admin' as UserRole, name: 'Admin Demo' },
  'user@teste.com': { role: 'user' as UserRole, name: 'Usuário Demo' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        mapSupabaseUserToUser(session.user);
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);
        
        if (session?.user) {
          mapSupabaseUserToUser(session.user);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserRole(null);
          setCompanyId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToUser = (supabaseUser: SupabaseUser) => {
    const mappedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
      full_name: supabaseUser.user_metadata?.full_name,
      role: 'user', // Default role, will be updated from profile
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at || supabaseUser.created_at
    };
    setUser(mappedUser);
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, company_id, full_name')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserRole(data.role as UserRole);
        setCompanyId(data.company_id);
        
        // Update user with profile data
        setUser(prev => prev ? {
          ...prev,
          role: data.role as UserRole,
          company_id: data.company_id,
          full_name: data.full_name || prev.full_name,
          name: data.full_name || prev.name
        } : null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const createDemoUser = async (email: string, password: string) => {
    const demoConfig = DEMO_USERS[email as keyof typeof DEMO_USERS];
    if (!demoConfig) {
      throw new Error('Email não é uma conta de demonstração válida');
    }

    try {
      // Try to sign up the demo user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: demoConfig.name,
            role: demoConfig.role
          }
        }
      });

      if (error && error.message !== 'User already registered') {
        throw error;
      }

      // If user already exists or was just created, try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

    } catch (error) {
      console.error('Error creating/signing in demo user:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    // Check if it's a demo account
    if (email in DEMO_USERS) {
      await createDemoUser(email, password);
      return;
    }

    // Regular login for non-demo accounts
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const register = async (userData: any) => {
    const { email, password, name } = userData;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: name
        }
      }
    });
    
    if (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isLoading: loading,
    login,
    logout: signOut,
    signOut,
    register,
    userRole,
    companyId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
