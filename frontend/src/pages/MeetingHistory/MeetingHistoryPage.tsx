import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ExternalLink, Clock, Users } from 'lucide-react';
import axios from 'axios';
import './MeetingHistoryPage.css';

const MeetingHistoryPage: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const response = await axios.get(`${backendUrl}/api/meetings/`);
      setMeetings(response.data);
    } catch (error) {
      console.error("Failed to fetch meetings", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.meeting_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Meeting History</h1>
        <p className="subtitle">Browse and manage your past AI-processed meetings</p>
      </header>

      <div className="history-actions">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search meetings by title or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className="icon-btn"><Filter size={20} /></button>
          <button className="icon-btn"><ArrowUpDown size={20} /></button>
        </div>
      </div>

      <div className="history-grid">
        {loading ? (
          <div className="loading-state">Loading meetings...</div>
        ) : filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <div key={meeting.meeting_id} className="history-card">
              <div className="card-top">
                <div className="meeting-badge">{meeting.category}</div>
                <div className="priority-mini" style={{ backgroundColor: getPriorityColor(meeting.priority) }} />
              </div>
              <h3 className="meeting-title">{meeting.title}</h3>
              <p className="meeting-summary">{meeting.summary?.substring(0, 120)}...</p>
              
              <div className="meeting-meta-row">
                <div className="meta-item"><Users size={14} /> {meeting.participants_count}</div>
                <div className="meta-item"><Clock size={14} /> {meeting.duration || 'N/A'}</div>
              </div>

              <div className="card-footer">
                <span className="meeting-date">{new Date(meeting.created_at).toLocaleDateString()}</span>
                <button className="view-btn">
                  View Report <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No meetings found.</div>
        )}
      </div>
    </div>
  );
};

export default MeetingHistoryPage;
