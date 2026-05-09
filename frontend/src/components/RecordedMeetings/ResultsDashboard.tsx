import React, { useState } from 'react';
import { 
  FileText, 
  ListTodo, 
  Users, 
  MessageSquare, 
  Download, 
  Calendar,
  Clock,
  Target,
  Mail,
  Edit2,
  Trash2,
  Copy,
  Send,
  FileDown,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './RecordedMeetings.css';

interface ResultsDashboardProps {
  data: any;
  onBack?: () => void;
  onNewAnalysis?: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onBack, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [notification, setNotification] = useState('');
  const [editedEmails, setEditedEmails] = useState<Record<string, string>>({});
  const [overview, setOverview] = useState(data?.summary || '');
  const [decisions, setDecisions] = useState(data?.key_decisions || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return <div>No data available</div>;

  const showNotif = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleEmailChange = (participantId: string, value: string) => {
    setEditedEmails({ ...editedEmails, [participantId]: value });
  };

  const handleSaveAll = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      
      const participantsWithEmails = (data.participants || []).map((p: any, i: number) => {
          const pId = p.id || `temp_${i}`;
          return {
            ...p,
            email: editedEmails[pId] !== undefined ? editedEmails[pId] : p.email
          };
      });

      const payload = {
        ...data,
        summary: overview,
        key_decisions: decisions,
        participants: participantsWithEmails,
        tasks: (data.tasks || []).map((t: any) => {
            const participant = participantsWithEmails.find((p: any) => t.employee_name.includes(p.name.split(' ')[0]));
            return {
              ...t,
              email: participant ? participant.email : (t.email || '')
            };
        })
      };

      const response = await fetch(`${backendUrl}/api/meetings/save_analysis/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showNotif('All data saved to database successfully!');
        setTimeout(() => {
          if (onNewAnalysis) onNewAnalysis();
        }, 1500);
      } else {
        showNotif('Failed to save data to database.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showNotif('Error saving data.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="results-dashboard-container">
      {notification && (
        <div className="custom-notif">
          <CheckCircle size={16} /> {notification}
        </div>
      )}

      <div className="results-header">
        <div className="result-header-left">
          <div className="result-icon-wrap">
            <CheckCircle size={32} color="#10b981" />
          </div>
          <div>
            <div className="result-title">Analysis Complete</div>
            <div className="result-meta">
              {data.title} - {data.duration || '45 min'} - {data.participants_count} participants
            </div>
          </div>
        </div>
        <div className="result-header-actions">
          <button className="result-btn" onClick={() => {
            navigator.clipboard.writeText(data.summary || '');
            showNotif('Copied to clipboard!');
          }}>
            <Copy size={14} /> Copy Summary
          </button>
        </div>
      </div>

      <div className="result-tabs">
        <button 
          className={`result-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >Summary</button>
        <button 
          className={`result-tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >Action Items</button>
        <button 
          className={`result-tab ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >Participants</button>
        <button 
          className={`result-tab ${activeTab === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcript')}
        >Transcript</button>
      </div>

      <div className="result-content-wrapper">
        <AnimatePresence mode="wait">
          {activeTab === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="summary-tab-content"
            >
              <div className="summary-main-col">
                <div className="summary-section nm-card">
                  <h4>Meeting Overview</h4>
                  <textarea 
                    className="nm-input-recessed"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="summary-section nm-card">
                  <h4>Key Decisions</h4>
                  <textarea 
                    className="nm-input-recessed"
                    value={decisions}
                    onChange={(e) => setDecisions(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="summary-section nm-card">
                  <h4>Person Task Summary</h4>
                  <div className="participant-task-grid">
                    {(data.participants || [])
                      .map((p: any, i: number) => {
                      const pTasks = data.tasks?.filter((t: any) => t.employee_name.includes(p.name.split(' ')[0])) || [];
                      const pId = p.id || `temp_${i}`;
                      const currentEmail = editedEmails[pId] !== undefined ? editedEmails[pId] : (p.email || `${p.name.toLowerCase().replace(' ', '.')}@company.com`);
                      
                      return (
                        <div key={i} className="participant-task-card nm-row">
                          <div className="person-task-label">Person Task</div>
                          <div className="participant-task-name">{p.name}</div>
                          <div className="participant-task-role">{p.role}</div>
                          <ul className="participant-task-list">
                            {pTasks.length > 0 ? pTasks.map((t: any, idx: number) => (
                              <li key={idx} contentEditable="true" spellCheck="false">{t.description}</li>
                            )) : (
                              <li contentEditable="true" spellCheck="false">No specific tasks assigned.</li>
                            )}
                          </ul>
                          <div className="mail-editor">
                            <input 
                              className="nm-input-recessed small" 
                              value={currentEmail} 
                              onChange={(e) => handleEmailChange(pId, e.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'actions' && (
            <motion.div 
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="actions-tab-content"
            >
              <h4>Action Items ({data.tasks_count} identified)</h4>
              <div className="action-items-list-alt">
                {(data.tasks || []).map((t: any, i: number) => (
                  <div key={i} className="action-item-alt">
                    <span className="action-dot-alt"></span>
                    <span><strong>{t.employee_name}</strong> - {t.description}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'participants' && (
            <motion.div 
              key="participants"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="participants-tab-content"
            >
              <h4>Participants ({data.participants_count} speakers)</h4>
              <div className="participants-grid-alt">
                {(data.participants || []).map((p: any, i: number) => (
                  <div key={i} className="participant-card-alt">
                    <div className={`participant-avatar-alt av-${i % 4}`}>
                      {p.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="participant-info-alt">
                      <div className="participant-name-alt">{p.name}</div>
                      <div className="participant-role-alt">{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'transcript' && (
            <motion.div 
              key="transcript"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="transcript-tab-content"
            >
              <div className="transcript-flow-alt">
                {(data.transcripts || []).map((t: any, i: number) => (
                  <div key={i} className="transcript-line-alt">
                    <span className="speaker-name">{t.speaker}</span> 
                    <span className="timestamp">{t.timestamp}</span>
                    <div className="transcript-text">{t.text}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="results-cta-row">
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
        <button className="primary-btn" onClick={onNewAnalysis}>
          New Analysis
        </button>
        <button 
          className="primary-btn" 
          onClick={handleSaveAll} 
          disabled={isSubmitting}
          style={{ marginLeft: 'auto' }}
        >
          <CheckCircle size={18} /> 
          {isSubmitting ? 'Submitting...' : 'Submit to Database'}
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
