"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { handleLogin, handleVerify, error, submitting, user } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");

  const requestCode = async () => {
    const ok = await handleLogin(email);
    if (ok) {
      setStep("code");
    }
  };

  const verifyCode = async () => {
    await handleVerify(code);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background to-primary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Sign in to Mochi-OS</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to receive a secure login code."
              : `We sent a code to ${user?.email ?? email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" ? (
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : (
            <Input
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {step === "email" ? (
            <Button className="w-full" onClick={requestCode} disabled={!email || submitting}>
              Request code
            </Button>
          ) : (
            <Button className="w-full" onClick={verifyCode} disabled={!code || submitting}>
              Verify code
            </Button>
          )}
          <p className="text-center text-sm text-muted-foreground">
            New to Mochi-OS? <Link href="/signup" className="font-semibold text-primary">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
