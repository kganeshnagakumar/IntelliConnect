import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  History, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  MoreHorizontal,
  Zap
} from 'lucide-react';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo animate-float">
              <LayoutDashboard size={32} className="logo-icon animate-glow" />
              <span className="logo-text">IntelliConnect</span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={24} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/recorded-meetings" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Video size={24} />
              <span>Recorded Meetings</span>
            </NavLink>
            
            <NavLink to="/history" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <History size={24} />
              <span>Meeting History</span>
            </NavLink>
            
            <NavLink to="/analytics" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BarChart3 size={24} />
              <span>Analytics</span>
            </NavLink>
          </nav>
          
          <div className="sidebar-footer">
            <NavLink to="/settings" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Settings size={24} />
              <span>Settings</span>
            </NavLink>
            <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <LogOut size={24} />
              <span>Logout</span>
            </div>
          </div>
        </aside>

        {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

        <main className="main-content">
          <Outlet />
        </main>

        <div className="gemini-watermark animate-float">
          <div className="sparkle-cluster">
            <Zap size={10} color="#7C3AED" fill="#7C3AED" className="animate-glow" />
          </div>
          <span className="watermark-text">Powered by Gemini</span>
          <div className="sparkle-cluster">
            <Zap size={10} color="#7C3AED" fill="#7C3AED" className="animate-glow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
