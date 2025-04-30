
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
          }, 1000); // Increased timeout to allow profile creation to complete
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignupWithEmail = async (email: string, password: string) => 
    await signupWithEmail(email, password, setIsLoading);

  const handleSignupAsBusinessOwner = async (email: string, password: string) => 
    await signupAsBusinessOwner(email, password, setIsLoading);

  const handleLoginWithEmail = async (email: string, password: string) => 
    await loginWithEmail(email, password, setIsLoading);

  const handleLoginAsBusinessOwner = async (username: string, password: string) => {
    console.log("Login as business owner attempt for:", username);
    const success = await loginAsBusinessOwner(username, password, setIsLoading);
    console.log("Business login success:", success);
    return success;
  };

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
