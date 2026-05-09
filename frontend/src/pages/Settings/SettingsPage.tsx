import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Cpu, 
  Database,
  Cloud,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>({ firstName: 'Pavan', lastName: 'Kumar', email: 'pavan@intelliconnect.ai' });
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('user', JSON.stringify(user));
      setStatusMsg('Profile updated successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'theme', label: 'Theme', icon: <Bell size={18} /> }
  ];

  return (
    <div className="page-container settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Configure your personal information and application appearance.</p>
      </header>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        <main className="settings-content">
          {activeTab === 'profile' && user && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                {statusMsg && <div className="success-msg"><CheckCircle size={14} /> {statusMsg}</div>}
              </div>
              <form className="settings-form" onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      value={user.firstName || ''} 
                      onChange={(e) => setUser({...user, firstName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      value={user.lastName || ''} 
                      onChange={(e) => setUser({...user, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={user.email} disabled />
                </div>
                <button className="primary-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Appearance</h3>
              </div>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Interface Theme</h4>
                    <p>Switch between light and dark modes for the dashboard.</p>
                  </div>
                  <div className="theme-toggle-group">
                    <button 
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => toggleTheme('light')}
                    >
                      Light
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => toggleTheme('dark')}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
