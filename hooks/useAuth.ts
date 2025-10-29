"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const { requestLoginCode, verifyCode, signup, logout, user, token, loading } =
    useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async (email: string) => {
    try {
      setSubmitting(true);
      setError(null);
      await signup(email);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to sign up");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (email: string) => {
    try {
      setSubmitting(true);
      setError(null);
      await requestLoginCode(email);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to request login code");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (code: string) => {
    try {
      setSubmitting(true);
      setError(null);
      await verifyCode({ code });
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Invalid code");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSignup,
    handleLogin,
    handleVerify,
    logout,
    user,
    token,
    loading,
    error,
    submitting
  };
};
