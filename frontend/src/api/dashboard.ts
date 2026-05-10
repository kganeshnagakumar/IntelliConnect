import apiClient from "./client";

export interface DashboardStats {
  total_meetings: number;
  completed_tasks: number;
  pending_tasks: number;
  priority_stats: {
    High: number;
    Medium: number;
    Low: number;
  };
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get("/api/meetings/dashboard_stats/");
  return response.data;
};
