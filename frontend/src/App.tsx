import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/Login/LoginScreen';
import MainLayout from './components/Layout/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import RecordedMeetingsPage from './pages/RecordedMeetings/RecordedMeetingsPage';
import MeetingHistoryPage from './pages/MeetingHistory/MeetingHistoryPage';
import SettingsPage from './pages/Settings/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginScreen />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/recorded-meetings" element={<RecordedMeetingsPage />} />
          <Route path="/history" element={<MeetingHistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
