"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const { handleSignup, error, submitting } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    const ok = await handleSignup(email);
    if (ok) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background to-primary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Create a Mochi-OS account</CardTitle>
          <CardDescription>
            We will send a confirmation email with next steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <div className="rounded-2xl bg-primary/10 p-4 text-sm text-primary">
              Check your inbox at {email}. You can now sign in with your email.
            </div>
          ) : (
            <>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button className="w-full" onClick={submit} disabled={!email || submitting}>
                Sign up
              </Button>
            </>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Already registered? <Link href="/signin" className="font-semibold text-primary">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
