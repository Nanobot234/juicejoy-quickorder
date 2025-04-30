
import React, { createContext } from "react";
import { User } from "../types";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { default as AuthProvider } from "./AuthProvider";
export { useAuth } from "./useAuth";
