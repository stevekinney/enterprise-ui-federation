export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface SummaryStats {
  totalUsers: number;
  activeToday: number;
  revenue: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export type TimeRange = "7d" | "30d" | "90d";
