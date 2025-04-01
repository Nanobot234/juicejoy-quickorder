
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBusinessOwner: boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (email: string, password: string) => Promise<boolean>;
  loginAsBusinessOwner: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          await fetchUserProfile(data.session);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await fetchUserProfile(session);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (session: Session) => {
    try {
      // Get user profile from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      
      // Create user object with Supabase data
      const user: User = {
        id: session.user.id,
        phone: data?.phone || '',
        name: data?.name || '',
        email: session.user.email || '',
        isBusinessOwner: data?.role === 'business_owner' || false
      };
      
      setCurrentUser(user);
    } catch (error) {
      console.error("Error processing user profile:", error);
    }
  };

  const signupWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        toast.success("Account created successfully!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        toast.success("Login successful");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginAsBusinessOwner = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Using email/password auth for business accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });
      
      if (error) {
        toast.error(error.message || "Invalid credentials");
        return false;
      }
      
      // Check if this user is a business owner
      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profileError || profile?.role !== 'business_owner') {
          // Not a business owner, sign out
          await supabase.auth.signOut();
          toast.error("This account does not have business owner privileges");
          return false;
        }
        
        toast.success("Business owner login successful");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error logging in as business owner:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isBusinessOwner: !!currentUser?.isBusinessOwner,
    loginWithEmail,
    signupWithEmail,
    loginAsBusinessOwner,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
