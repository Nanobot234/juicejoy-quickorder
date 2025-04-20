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
  signupAsBusinessOwner: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
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
        console.log("Auth state changed:", event, session?.user?.id);
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
      console.log("Fetching profile for user:", session.user.id);
      // Get user profile from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      
      // If no profile exists, create one
      if (!data) {
        console.log("No profile found, creating one for user:", session.user.id);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            role: 'customer' // Default role
          });
          
        if (insertError) {
          console.error("Error creating user profile:", insertError);
          toast.error("Failed to create user profile");
          return;
        }
        
        // Fetch the newly created profile
        const { data: newProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching new user profile:", fetchError);
          return;
        }
        
        console.log("Created new profile:", newProfile);
        
        // Create user object with the new profile data
        const user: User = {
          id: session.user.id,
          phone: newProfile?.phone || '',
          name: newProfile?.name || '',
          email: session.user.email || '',
          isBusinessOwner: newProfile?.role === 'business_owner' || false
        };
        
        console.log("Setting current user:", user);
        setCurrentUser(user);
        setIsLoading(false);
        return;
      }
      
      console.log("User profile data found:", data);
      
      // Create user object with Supabase data
      const user: User = {
        id: session.user.id,
        phone: data?.phone || '',
        name: data?.name || '',
        email: session.user.email || '',
        isBusinessOwner: data?.role === 'business_owner' || false
      };
      
      console.log("Setting current user:", user);
      setCurrentUser(user);
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing user profile:", error);
      setIsLoading(false);
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

  const signupAsBusinessOwner = async (email: string, password: string): Promise<boolean> => {
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
        // Update the profile to mark this user as a business owner
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'business_owner' })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error("Error updating profile as business owner:", profileError);
          toast.error("Account created, but failed to set business owner status");
          return false;
        }
        
        toast.success("Business account created successfully!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error signing up as business owner:", error);
      toast.error("Failed to create business account");
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
    signupAsBusinessOwner,
    logout,
    setCurrentUser
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
