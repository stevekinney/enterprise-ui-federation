import { createRoot } from "react-dom/client";
import { worker } from "@pulse/mocks";
import { App } from "./app";
import "./index.css";

async function start(): Promise<void> {
  await worker.start({ onUnhandledRequest: "bypass" });

  const container = document.getElementById("root");
  if (!container) throw new Error("Root element not found");

  const root = createRoot(container);
  root.render(<App />);
}

start();
