import React from "react";
import type { SummaryStats } from "@pulse/shared";

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps): React.ReactElement {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function StatsBar({
  stats,
}: {
  stats: SummaryStats;
}): React.ReactElement {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} />
      <StatCard label="Active Today" value={formatNumber(stats.activeToday)} />
      <StatCard label="Revenue" value={formatCurrency(stats.revenue)} />
      <StatCard
        label="Conversion Rate"
        value={formatPercentage(stats.conversionRate)}
      />
    </div>
  );
}
