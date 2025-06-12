
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
        handleUserSession(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);
        
        if (session?.user) {
          handleUserSession(session.user);
        } else {
          setUser(null);
          setUserRole(null);
          setCompanyId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (supabaseUser: SupabaseUser) => {
    console.log('Handling user session for:', supabaseUser.email);
    
    // Map supabase user to our user format
    const mappedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
      full_name: supabaseUser.user_metadata?.full_name,
      role: 'user', // Default role, will be updated
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at || supabaseUser.created_at
    };

    // Check if it's a demo user and ensure profile exists
    if (supabaseUser.email && supabaseUser.email in DEMO_USERS) {
      const demoConfig = DEMO_USERS[supabaseUser.email as keyof typeof DEMO_USERS];
      console.log('Demo user detected:', supabaseUser.email, 'Role:', demoConfig.role);
      
      // Ensure demo user profile exists
      await ensureDemoUserProfile(supabaseUser.id, supabaseUser.email, demoConfig);
      
      // Set the user data immediately for demo users
      const userWithRole = {
        ...mappedUser,
        role: demoConfig.role,
        name: demoConfig.name,
        full_name: demoConfig.name
      };
      
      setUser(userWithRole);
      setUserRole(demoConfig.role);
    } else {
      setUser(mappedUser);
    }

    // Fetch user profile from database
    await fetchUserProfile(supabaseUser.id);
  };

  const ensureDemoUserProfile = async (userId: string, email: string, demoConfig: any) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        console.log('Creating demo user profile for:', email);
        // Create profile for demo user
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            full_name: demoConfig.name,
            role: demoConfig.role
          });

        if (error) {
          console.error('Error creating demo user profile:', error);
        } else {
          console.log('Demo user profile created successfully');
        }
      } else if (existingProfile.role !== demoConfig.role) {
        console.log('Updating demo user role from', existingProfile.role, 'to', demoConfig.role);
        // Update role if it doesn't match
        const { error } = await supabase
          .from('profiles')
          .update({ role: demoConfig.role, full_name: demoConfig.name })
          .eq('id', userId);

        if (error) {
          console.error('Error updating demo user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error ensuring demo user profile:', error);
    }
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
        console.log('Profile data fetched:', data);
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

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    
    // Check if it's a demo account
    if (email in DEMO_USERS) {
      console.log('Demo login for:', email);
      
      try {
        // First try to sign in directly
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If sign in fails, try to create the demo user
        if (signInError) {
          console.log('Direct sign in failed, creating demo user:', signInError.message);
          
          const demoConfig = DEMO_USERS[email as keyof typeof DEMO_USERS];
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

          if (signUpError && !signUpError.message.includes('User already registered')) {
            throw signUpError;
          }

          // If user was created but needs confirmation, try admin sign in
          if (signUpData?.user && !signUpData.session) {
            console.log('User created but not confirmed, trying sign in again...');
            
            // Wait a moment and try again
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (retryError) {
              throw new Error('Conta de demonstração criada. Por favor, confirme o email ou desabilite a confirmação de email nas configurações do Supabase para usar as contas demo.');
            }
          }
        }
      } catch (error: any) {
        console.error('Demo login error:', error);
        throw error;
      }
    } else {
      // Regular login for non-demo accounts
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
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
