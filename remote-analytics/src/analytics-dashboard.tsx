import React, { useEffect, useState } from "react";
import type { SummaryStats, ChartDataPoint, TimeRange } from "@pulse/shared";
import { StatsBar } from "./stats-bar";
import { Chart } from "./chart";
import "./index.css";

export function AnalyticsDashboard(): React.ReactElement {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [loading, setLoading] = useState(true);

  // THE BUG: This component has no access to the host's auth context.
  // It cannot read the current user or auth token.
  // On the main branch, this is intentionally broken.
  const isAuthenticated = false;
  const userName: string | null = null;

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const [summaryResponse, chartResponse] = await Promise.all([
          fetch("/api/analytics/summary"),
          fetch(`/api/analytics/chart?range=${timeRange}`),
        ]);

        const summaryResult: SummaryStats = await summaryResponse.json();
        const chartResult: ChartDataPoint[] = await chartResponse.json();

        setSummary(summaryResult);
        setChartData(chartResult);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Analytics Overview
        </h2>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Viewing as: {userName}
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Not authenticated
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading analytics data...</div>
        </div>
      ) : (
        <>
          {summary && <StatsBar stats={summary} />}

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Activity</h3>
              <div className="flex gap-1">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`rounded-md px-3 py-1 text-sm ${
                      timeRange === range
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <Chart data={chartData} />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
