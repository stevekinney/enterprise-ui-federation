import React, { Suspense } from "react";
import { AuthProvider } from "./shell/auth-provider";
import { Layout } from "./shell/layout";
import { ErrorBoundary } from "./shell/error-boundary";

const AnalyticsDashboard = React.lazy(
  () => import("remoteAnalytics/analytics-dashboard"),
);

export function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Layout>
        <ErrorBoundary
          fallback={
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
              <h2 className="text-lg font-semibold">
                Failed to load Analytics
              </h2>
              <p className="mt-2 text-sm">
                The remote analytics module could not be loaded. Make sure the
                remote is running on port 3001.
              </p>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-12">
                <div className="text-gray-500">Loading analytics...</div>
              </div>
            }
          >
            <AnalyticsDashboard />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </AuthProvider>
  );
}
