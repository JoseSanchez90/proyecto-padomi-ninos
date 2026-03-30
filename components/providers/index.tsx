// components/providers/index.tsx
"use client";

import { AuthProvider } from "@/lib/contexts/AuthContext";
import { RegistroProvider } from "@/lib/contexts/RegistroContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RegistroProvider>{children}</RegistroProvider>
    </AuthProvider>
  );
}
