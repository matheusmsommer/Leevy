
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = async () => {
      try {
        // TODO: Replace with actual Supabase auth check
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase auth
      console.log('Login attempt:', { email, password });
      
      // Mock login for now
      const mockUser: User = {
        id: '1',
        email,
        name: 'Demo User',
        role: email.includes('admin') ? 'admin' : email.includes('super') ? 'superadmin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // TODO: Replace with actual Supabase auth
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase auth and database operations
      console.log('Register attempt:', userData);
      
      // Mock registration
      const mockUser: User = {
        id: Math.random().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        cpf: userData.cpf,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
