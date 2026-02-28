import { createRoot } from "react-dom/client";
import { worker } from "@pulse/mocks";
import { AnalyticsDashboard } from "./analytics-dashboard";
import "./index.css";

async function start(): Promise<void> {
  await worker.start({ onUnhandledRequest: "bypass" });

  const container = document.getElementById("root");
  if (!container) throw new Error("Root element not found");

  const root = createRoot(container);
  root.render(
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Analytics (Standalone)
      </h1>
      <AnalyticsDashboard />
    </div>,
  );
}

start();
