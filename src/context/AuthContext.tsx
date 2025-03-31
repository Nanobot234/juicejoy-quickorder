import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { User } from "../types";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBusinessOwner: boolean;
  login: (phone: string, code: string) => Promise<boolean>;
  loginAsBusinessOwner: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendVerificationCode: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in a real app, this would be in a backend
const MOCK_USERS: Record<string, User> = {
  "+12345678900": {
    id: "user1",
    phone: "+12345678900",
    name: "John Doe",
    email: "john@example.com"
  },
  "+12345678901": {
    id: "user2",
    phone: "+12345678901",
    name: "Jane Smith",
    email: "jane@example.com"
  },
  // Business owner account
  "owner": {
    id: "owner",
    phone: "+19876543210",
    name: "Business Owner",
    email: "owner@juicejoy.com",
    isBusinessOwner: true
  }
};

// In a real app this would be stored securely in a database
const BUSINESS_CREDENTIALS = {
  username: "admin",
  password: "juicejoy123"
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("juicejoy-user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("juicejoy-user");
      }
    }
    setIsLoading(false);
  }, []);

  const sendVerificationCode = async (phone: string): Promise<boolean> => {
    // In a real app, this would call an API to send an SMS
    // For demo purposes, we'll just check if the user exists
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!phone.startsWith("+")) {
        toast.error("Phone number must include country code (e.g., +1...)");
        return false;
      }
      
      // In a real app, we would always send the code regardless of whether
      // the user exists already or not (for security reasons)
      toast.success(`Verification code sent to ${phone}. Use 123456 to login.`);
      return true;
    } catch (error) {
      toast.error("Failed to send verification code");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, verify the code with a backend service
      if (code !== "123456") {
        toast.error("Invalid verification code");
        return false;
      }
      
      // Check if user exists in our mock database
      const user = MOCK_USERS[phone];
      
      if (user) {
        // Existing user
        setCurrentUser(user);
        localStorage.setItem("juicejoy-user", JSON.stringify(user));
        toast.success("Login successful");
        return true;
      } else {
        // New user - create an account
        const newUser: User = {
          id: `user${Date.now()}`,
          phone
        };
        
        MOCK_USERS[phone] = newUser;
        setCurrentUser(newUser);
        localStorage.setItem("juicejoy-user", JSON.stringify(newUser));
        toast.success("Account created successfully");
        return true;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginAsBusinessOwner = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === BUSINESS_CREDENTIALS.username && password === BUSINESS_CREDENTIALS.password) {
        const owner = MOCK_USERS["owner"];
        setCurrentUser(owner);
        localStorage.setItem("juicejoy-user", JSON.stringify(owner));
        toast.success("Business owner login successful");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("juicejoy-user");
    toast.info("Logged out successfully");
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isBusinessOwner: !!currentUser?.isBusinessOwner,
    login,
    loginAsBusinessOwner,
    logout,
    sendVerificationCode
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
