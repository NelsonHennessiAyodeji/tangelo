"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/types";
import { AuthContext } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

// A mock user for the demo phase.
const mockUser: AuthUser = {
  id: "mock-user-id",
  email: "tunde@example.com",
  name: "Tunde Adebayo",
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // In a demo, we can just assume the user is logged in
  // on all pages except the landing/login/signup pages.
  useEffect(() => {
    if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
      setUser(null);
    } else {
      setUser(mockUser);
    }
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-16 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
