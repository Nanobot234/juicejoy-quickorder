
import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { fetchUserProfile, signupWithEmail, signupAsBusinessOwner, loginWithEmail, loginAsBusinessOwner, logout } from "./authUtils";
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          fetchUserProfile(data.session, setCurrentUser, setIsLoading);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setTimeout(() => {
            fetchUserProfile(session, setCurrentUser, setIsLoading);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignupWithEmail = (email: string, password: string) => 
    signupWithEmail(email, password, setIsLoading);

  const handleSignupAsBusinessOwner = (email: string, password: string) => 
    signupAsBusinessOwner(email, password, setIsLoading);

  const handleLoginWithEmail = (email: string, password: string) => 
    loginWithEmail(email, password, setIsLoading);

  const handleLoginAsBusinessOwner = (username: string, password: string) => 
    loginAsBusinessOwner(username, password, setIsLoading);

  const handleLogout = () => logout(setCurrentUser);

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isBusinessOwner: !!currentUser?.isBusinessOwner,
    loginWithEmail: handleLoginWithEmail,
    signupWithEmail: handleSignupWithEmail,
    loginAsBusinessOwner: handleLoginAsBusinessOwner,
    signupAsBusinessOwner: handleSignupAsBusinessOwner,
    logout: handleLogout,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
