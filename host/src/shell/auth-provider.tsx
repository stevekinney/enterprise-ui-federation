import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthContext as AuthContextType } from "@pulse/shared";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  token: null,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser(): Promise<void> {
      try {
        const response = await fetch("/api/users/me");
        const data: User = await response.json();
        setUser(data);
        setToken("mock-jwt-token-" + data.id);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Authenticating...</div>
      </div>
    );
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
