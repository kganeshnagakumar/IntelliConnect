import { apiClient } from './api';

export interface PriorityStats {
  High: number;
  Medium: number;
  Low: number;
}

export interface DashboardStats {
  total_meetings: number;
  total_tasks: number;
  priority_stats: PriorityStats;
}

export interface DashboardMeeting {
  id: number;
  meeting_id: string;
  title: string;
  summary: string;
  priority: string;
  participants_count: number;
  tasks_count: number;
  duration: string;
  created_at: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/api/meetings/dashboard_stats/');
    return response.data;
  },
  async getMeetings(): Promise<DashboardMeeting[]> {
    const response = await apiClient.get<DashboardMeeting[]>('/api/meetings/');
    return response.data;
  },
};
