"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthUser, getProfile } from "@/lib/auth-api";

const TOKEN_KEY = "access_token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(storedToken);
        if (isMounted) {
          setToken(storedToken);
          setUser(profile);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, setSession, logout }),
    [user, token, isLoading, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
