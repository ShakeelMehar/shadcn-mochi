import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/navigation/RequireAuth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
