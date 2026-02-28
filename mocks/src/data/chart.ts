import type { ChartDataPoint } from "@pulse/shared";

function generateChartData(days: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const baseDate = new Date("2025-01-01");

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    const sineValue = Math.sin((i / days) * Math.PI * 2);
    const noise = Math.sin(i * 7.3) * 0.15;
    const value = Math.round(5000 + sineValue * 2000 + noise * 1000);

    data.push({
      date: date.toISOString().split("T")[0],
      value,
      label: `Day ${i + 1}`,
    });
  }

  return data;
}

export const chartData30d = generateChartData(30);
export const chartData7d = chartData30d.slice(-7);
export const chartData90d = generateChartData(90);
