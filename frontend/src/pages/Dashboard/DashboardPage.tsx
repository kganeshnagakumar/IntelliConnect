import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, 
  Camera, 
  Clock, 
  MoreHorizontal,
  ListTodo,
  BarChart2
} from 'lucide-react';
import './DashboardPage.css';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardMeeting, DashboardStats } from '../../services/dashboardService';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [meetings, setMeetings] = useState<DashboardMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        const [statsResponse, meetingsResponse] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getMeetings(),
        ]);
        if (cancelled) return;
        setStats(statsResponse);
        setMeetings(meetingsResponse);
        setError(null);
      } catch (fetchError) {
        if (cancelled) return;
        console.error('Failed to fetch dashboard data', fetchError);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, [retryToken]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryToken((prev) => prev + 1);
  };

  const priorityStats = useMemo(
    () => stats?.priority_stats ?? { High: 0, Medium: 0, Low: 0 },
    [stats],
  );

  if (loading) {
    return <div className="dashboard-status">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-status">
        <p>{error}</p>
        <button className="retry-btn" onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Meeting intelligence and organizational task overview.</p>
        </div>
        <button className="import-btn">
          <BarChart2 size={18} />
          Import Power BI
        </button>
      </header>
      
      <div className="header-underline"></div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper">
            <Camera size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Meetings</span>
            <h3 className="kpi-value">{stats?.total_meetings ?? 0}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper">
            <ListTodo size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Extracted Tasks</span>
            <h3 className="kpi-value">{stats?.total_tasks ?? 0}</h3>
          </div>
        </div>

        <div className="kpi-card priority-stats-card">
          <div className="priority-item">
            <span className="priority-dot red"></span>
            <span className="label">High Priority</span>
            <span className="value">{priorityStats.High}</span>
          </div>
          <div className="priority-item">
            <span className="priority-dot orange"></span>
            <span className="label">Medium Priority</span>
            <span className="value">{priorityStats.Medium}</span>
          </div>
          <div className="priority-item">
            <span className="priority-dot green"></span>
            <span className="label">Low Priority</span>
            <span className="value">{priorityStats.Low}</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-header-row">
          <h2>Intelligence Table</h2>
          <a href="#" className="detailed-view-link">Detailed View &gt;</a>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>MEETING INFO</th>
                <th>PRIORITY</th>
                <th>PARTICIPANTS</th>
                <th>DATE</th>
                <th>TASKS</th>
                <th>DURATION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <tr key={meeting.id} className="table-row">
                    <td style={{ width: '40%' }}>
                      <span className="meeting-title">{meeting.title}</span>
                      <span className="meeting-desc">
                        {meeting.summary ? `${meeting.summary.substring(0, 80)}...` : 'No summary available.'}
                      </span>
                    </td>
                    <td>
                      <div className={`priority-badge ${(meeting.priority || 'Medium').toLowerCase()}`}>
                        <span className="priority-dot" style={{ backgroundColor: 'currentColor' }}></span>
                        {(meeting.priority || 'Medium').toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div className="cell-content">
                        <Users size={14} />
                        {meeting.participants_count}
                      </div>
                    </td>
                    <td>
                      <div className="cell-content">{new Date(meeting.created_at).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <span className="task-badge">{meeting.tasks_count} extracted</span>
                    </td>
                    <td>
                      <div className="cell-content">
                        <Clock size={14} />
                        {meeting.duration || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <MoreHorizontal size={18} className="more-btn" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="table-row">
                  <td colSpan={7} className="dashboard-empty-row">No meetings available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
