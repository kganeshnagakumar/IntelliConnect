import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import axios from 'axios';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/meetings/analytics_stats/`);
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container">Loading Intelligence...</div>;

  return (
    <div className="page-container analytics-page">
      <header className="page-header">
        <h1>Analytics</h1>
        <p className="subtitle">Real-time organizational intelligence and meeting performance.</p>
      </header>

      <div className="analytics-grid">
        {/* Main Chart */}
        <div className="chart-card large">
          <div className="card-header">
            <h3>Meeting Activity Trends</h3>
            <div className="time-filter">
              <button className="active">Week</button>
              <button>Month</button>
            </div>
          </div>
          <div className="visual-container">
            <div className="mock-bar-chart">
              {(stats?.activity_trends || [60, 40, 80, 55, 90, 70, 85]).map((h: number, i: number) => (
                <div key={i} className="bar-wrapper">
                  <div className="bar" style={{ height: `${h}%` }}>
                    <div className="bar-glow" />
                  </div>
                  <span className="bar-label">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="stats-col">
          <div className="mini-card">
            <div className="mini-icon blue"><Activity size={20} /></div>
            <div className="mini-content">
              <span className="mini-label">Efficiency Score</span>
              <div className="mini-value-row">
                <span className="mini-value">{stats?.efficiency_score || 0}%</span>
                <span className="trend up"><ArrowUpRight size={14} /> 12%</span>
              </div>
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-icon purple"><Zap size={20} /></div>
            <div className="mini-content">
              <span className="mini-label">AI Accuracy</span>
              <div className="mini-value-row">
                <span className="mini-value">{stats?.ai_accuracy || 0}%</span>
                <span className="trend up"><ArrowUpRight size={14} /> 2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="chart-card">
          <div className="card-header">
            <h3>Department Distribution</h3>
          </div>
          <div className="visual-container centered">
            <div className="mock-pie-chart" style={{ 
              background: `conic-gradient(var(--primary) 0% 50%, #a855f7 50% 80%, #f59e0b 80% 100%)` 
            }}>
              <div className="pie-center">
                <span className="total-label">Total</span>
                <span className="total-value">{stats?.department_distribution?.length || 0}</span>
              </div>
            </div>
            <div className="pie-legend">
              {(stats?.department_distribution || []).slice(0, 3).map((d: any, i: number) => (
                <div key={i} className="legend-item">
                  <span className={`dot s${i+1}`} /> {d.category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="chart-card">
          <div className="card-header">
            <h3>Top Intelligence Categories</h3>
          </div>
          <div className="categories-list">
            {(stats?.categories || []).map((cat: any, i: number) => (
              <div key={i} className="category-item">
                <div className="cat-info">
                  <span className="cat-label">{cat.category}</span>
                  <span className="cat-count">{cat.percentage}%</span>
                </div>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{ 
                    width: `${cat.percentage * 10}%`, 
                    backgroundColor: i === 0 ? 'var(--primary)' : '#a855f7' 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
