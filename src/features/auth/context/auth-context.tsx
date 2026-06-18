"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import Swal from "sweetalert2";

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: User;
  roles?: string[];
}

interface MeResponse {
  success: boolean;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  fetchCurrentUser: async () => {},
});

// Premium toast helper
const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string) => {
  Swal.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-xl shadow-lg border border-[#E9EDF5]'
    },
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load and restore session
  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    const storedToken = localStorage.getItem("auth_token");
    const storedRoles = localStorage.getItem("auth_roles");
    
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setRoles([]);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setToken(storedToken);
      if (storedRoles) {
        setRoles(JSON.parse(storedRoles));
      }
      
      const res = await http.get<MeResponse>("/me");
      if (res && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        // If user object has roles, use them, otherwise fallback to stored roles
        const userRoles = res.user.roles || (storedRoles ? JSON.parse(storedRoles) : ["Admin"]);
        setRoles(userRoles);
        localStorage.setItem("auth_roles", JSON.stringify(userRoles));
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      
      // Clean up token and state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_roles");
      setUser(null);
      setToken(null);
      setRoles([]);
      setIsAuthenticated(false);
      
      if (error instanceof HttpError) {
        if (error.status === 401) {
          showToast("warning", "Session Expired. Please login again.");
        } else {
          showToast("error", "Unable to connect to server.");
        }
      } else {
        showToast("error", "Unable to connect to server.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login flow
  const login = async (email: string, password: string) => {
    try {
      const res = await http.post<LoginResponse>("/login", { email, password });
      
      if (res && res.token && res.user) {
        const userRoles = res.roles || res.user.roles || ["Admin"];
        
        localStorage.setItem("auth_token", res.token);
        localStorage.setItem("auth_roles", JSON.stringify(userRoles));
        
        setToken(res.token);
        setUser(res.user);
        setRoles(userRoles);
        setIsAuthenticated(true);
        
        showToast("success", "Welcome Back! Login successful.");
        router.push("/dashboard");
      } else {
        throw new Error(res?.message || "Invalid login response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      let errorMessage = "Invalid email or password.";
      if (error instanceof HttpError) {
        if (error.status === 401) {
          errorMessage = error.info?.message || "Invalid email or password.";
        } else if (error.status === 422) {
          errorMessage = error.message; // Laravel validation error
        } else {
          errorMessage = error.message || "Unable to connect to server.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showToast("error", errorMessage);
      throw error;
    }
  };

  // Logout flow
  const logout = async () => {
    try {
      // Best-effort logout call to backend
      await http.post("/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      // Always clear local state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_roles");
      setUser(null);
      setToken(null);
      setRoles([]);
      setIsAuthenticated(false);
      showToast("success", "Logged out successfully.");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roles,
        isAuthenticated,
        isLoading,
        login,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
