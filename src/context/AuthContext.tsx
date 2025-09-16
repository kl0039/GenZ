import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'facebook') => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        console.log('Auth state changed:', event, sessionData);
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success('Successfully logged in!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been logged out');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: sessionData } }) => {
      console.log('Initial session:', sessionData);
      setSession(sessionData);
      setUser(sessionData?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: 'google' | 'facebook') => {
    try {
      console.log(`Attempting ${provider} login...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      console.log('OAuth response:', { data, error });
      
      if (error) {
        console.error('Social login error:', error);
        
        // Handle specific error cases
        if (error.message.includes('provider is not enabled')) {
          toast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not configured. Please use another login method.`);
        } else if (error.message.includes('redirect')) {
          toast.error(`Redirect URL configuration error. Please check your ${provider} OAuth settings.`);
        } else {
          toast.error(`Failed to login with ${provider}: ${error.message}`);
        }
        throw error;
      }
      
      // If we get here without error, the redirect should happen automatically
      console.log('OAuth initiated successfully');
    } catch (error: any) {
      console.error(`Error during ${provider} login:`, error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) throw error;
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast.error("Failed to log out. Please try again.");
      throw error;
    }
  };

  const toggleFavorite = (productId: string) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    // This is a client-side only implementation
    // In a real app, you would update favorites in your Supabase database
    setUser(prev => {
      if (!prev) return prev;

      let newFavorites;
      const currentFavorites = prev.user_metadata?.favorites || [];
      
      if (currentFavorites.includes(productId)) {
        newFavorites = currentFavorites.filter((id: string) => id !== productId);
        toast.info("Removed from favorites");
      } else {
        newFavorites = [...currentFavorites, productId];
        toast.success("Added to favorites");
      }

      // Update user metadata (this is just for state management - to persist you'd update Supabase)
      const updatedUser = { 
        ...prev, 
        user_metadata: { 
          ...prev.user_metadata,
          favorites: newFavorites 
        } 
      };
      
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, loginWithSocial, register, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
