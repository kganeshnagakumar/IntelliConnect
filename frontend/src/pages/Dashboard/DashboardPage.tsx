import React from 'react';
import { 
  Users, 
  Camera, 
  Clock, 
  MoreHorizontal,
  ChevronRight,
  ListTodo,
  BarChart2
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  // Hardcoded data to match the screenshot exactly as requested
  const stats = {
    total_meetings: 2,
    total_tasks: 5,
    priority_stats: { High: 0, Medium: 2, Low: 0 }
  };

  const meetings = [
    {
      id: 1,
      title: "Finance & Corporate Committee - Zoom Meeting - Waipā District Council (128k)_compressed.mp3",
      description: "This meeting of the Whalara District Council prima...",
      priority: "HIGH",
      participants: 8,
      date: "5/8/2026",
      tasks: "2 extracted",
      duration: "45:00"
    },
    {
      id: 2,
      title: "Marketing Campaign Review - Q2 Launch (B)",
      description: "This meeting of the Marketing Campaign Review - Q2 Launch",
      priority: "MEDIUM",
      participants: 10,
      date: "5/5/2026",
      tasks: "3 extracted",
      duration: "60:00"
    },
    {
      id: 3,
      title: "Product Backlog Refinement - Sprint 12 (C)",
      description: "This meeting of the Whalara District Council cov...",
      priority: "LOW",
      participants: 6,
      date: "5/5/2026",
      tasks: "0 extracted",
      duration: "45:00"
    },
    {
      id: 4,
      title: "Executive Board Briefing - Strategic Plan (D)",
      description: "This meeting of the Whalara District Council primo...",
      priority: "HIGH",
      participants: 12,
      date: "5/8/2026",
      tasks: "2 extracted",
      duration: "75:00"
    }
  ];

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
            <h3 className="kpi-value">{stats.total_meetings}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper">
            <ListTodo size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Extracted Tasks</span>
            <h3 className="kpi-value">{stats.total_tasks}</h3>
          </div>
        </div>

        <div className="kpi-card priority-stats-card">
          <div className="priority-item">
            <span className="priority-dot red"></span>
            <span className="label">High Priority</span>
            <span className="value">{stats.priority_stats.High}</span>
          </div>
          <div className="priority-item">
            <span className="priority-dot orange"></span>
            <span className="label">Medium Priority</span>
            <span className="value">{stats.priority_stats.Medium}</span>
          </div>
          <div className="priority-item">
            <span className="priority-dot green"></span>
            <span className="label">Low Priority</span>
            <span className="value">{stats.priority_stats.Low}</span>
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
              {meetings.map((m) => (
                <tr key={m.id} className="table-row">
                  <td style={{ width: '40%' }}>
                    <span className="meeting-title">{m.title}</span>
                    <span className="meeting-desc">{m.description}</span>
                  </td>
                  <td>
                    <div className={`priority-badge ${m.priority.toLowerCase()}`}>
                      <span className="priority-dot" style={{ backgroundColor: 'currentColor' }}></span>
                      {m.priority}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <Users size={14} />
                      {m.participants}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">{m.date}</div>
                  </td>
                  <td>
                    <span className="task-badge">{m.tasks}</span>
                  </td>
                  <td>
                    <div className="cell-content">
                      <Clock size={14} />
                      {m.duration}
                    </div>
                  </td>
                  <td>
                    <MoreHorizontal size={18} className="more-btn" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
