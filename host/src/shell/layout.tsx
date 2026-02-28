import React from "react";
import { Nav } from "./nav";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
        </div>
        <Nav />
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
