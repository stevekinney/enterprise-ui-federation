import { http, HttpResponse, delay } from "msw";
import type { TimeRange } from "@pulse/shared";
import { summaryData } from "./data/summary";
import { chartData7d, chartData30d, chartData90d } from "./data/chart";
import { currentUser } from "./data/users";

const chartDataByRange: Record<TimeRange, typeof chartData30d> = {
  "7d": chartData7d,
  "30d": chartData30d,
  "90d": chartData90d,
};

export const handlers = [
  http.get("/api/analytics/summary", async () => {
    await delay(200);
    return HttpResponse.json(summaryData);
  }),

  http.get("/api/analytics/chart", async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    const range = (url.searchParams.get("range") ?? "30d") as TimeRange;
    return HttpResponse.json(chartDataByRange[range]);
  }),

  http.get("/api/users/me", async () => {
    await delay(100);
    return HttpResponse.json(currentUser);
  }),
];
