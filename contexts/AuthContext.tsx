"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { persistToken } from "@/lib/utils";

export interface UserProfile {
  email: string;
  login?: boolean;
}

interface AuthContextProps {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  requestLoginCode: (email: string) => Promise<void>;
  verifyCode: (payload: { code: string }) => Promise<void>;
  signup: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("mochi_token") : null;
    if (storedToken) {
      setToken(storedToken);
      setUser({ email: localStorage.getItem("mochi_email") ?? "" });
    }
    setLoading(false);
  }, []);

  const requestLoginCode = useCallback(async (email: string) => {
    await apiClient.post("/login", { email });
    setUser({ email });
    if (typeof window !== "undefined") {
      localStorage.setItem("mochi_email", email);
    }
  }, []);

  const verifyCode = useCallback(
    async (payload: { code: string }) => {
      const { data } = await apiClient.post("/login/auth", payload);
      const receivedToken = data?.token;
      if (receivedToken) {
        setToken(receivedToken);
        persistToken(receivedToken);
        const email = data?.login?.email ?? user?.email ?? "";
        setUser({ email });
        if (typeof window !== "undefined") {
          localStorage.setItem("mochi_email", email);
        }
        router.replace("/overview");
      }
    },
    [router, user?.email]
  );

  const signup = useCallback(async (email: string) => {
    await apiClient.post("/signup", { email });
    setUser({ email });
    if (typeof window !== "undefined") {
      localStorage.setItem("mochi_email", email);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    persistToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mochi_email");
    }
    router.replace("/signin");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      requestLoginCode,
      verifyCode,
      signup,
      logout
    }),
    [user, token, loading, requestLoginCode, verifyCode, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
