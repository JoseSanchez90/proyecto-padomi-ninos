"use client";

import { AuthProvider } from "@/lib/contexts/AuthContext";

export function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
