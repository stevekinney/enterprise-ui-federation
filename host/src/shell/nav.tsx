import React from "react";
import { useAuth } from "./auth-provider";

export function Nav(): React.ReactElement {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="space-y-2 px-4">
      <a
        href="#"
        className="block rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900"
      >
        Analytics
      </a>
      <div className="mt-8 border-t border-gray-200 pt-4">
        {isAuthenticated && user ? (
          <div className="px-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        ) : (
          <div className="px-3 text-sm text-gray-400">Not signed in</div>
        )}
      </div>
    </nav>
  );
}
