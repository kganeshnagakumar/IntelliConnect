import React, { useState } from 'react';
import { Settings2, Zap, Layout, Globe, Clock, Tag } from 'lucide-react';
import './RecordedMeetings.css';

interface ConfigureStepProps {
  onBack: () => void;
  onNext: (config: any) => void;
  initialConfig: any;
}

const ConfigureStep: React.FC<ConfigureStepProps> = ({ onBack, onNext, initialConfig }) => {
  const [config, setConfig] = useState(initialConfig);

  const toggleOption = (key: string) => {
    setConfig({
      ...config,
      toggles: {
        ...config.toggles,
        [key]: !config.toggles[key]
      }
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="configure-step">
      <div className="config-grid">
        <div className="config-section">
          <h3><Settings2 size={20} /> Analysis Settings</h3>
          <div className="options-group">
            <div className="option-field">
              <label><Layout size={16} /> Summary Style</label>
              <div className="select-wrapper">
                <select name="summaryStyle" value={config.summaryStyle} onChange={handleSelectChange}>
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Bullet Points</option>
                  <option>Executive Summary</option>
                </select>
              </div>
            </div>
            
            <div className="option-field">
              <label><Globe size={16} /> Output Language</label>
              <div className="select-wrapper">
                <select name="language" value={config.language} onChange={handleSelectChange}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            <div className="option-field">
              <label><Clock size={16} /> Summary Length</label>
              <div className="select-wrapper">
                <select name="length" value={config.length} onChange={handleSelectChange}>
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Comprehensive</option>
                </select>
              </div>
            </div>

            <div className="option-field">
              <label><Tag size={16} /> Meeting Category</label>
              <div className="select-wrapper">
                <select name="category" value={config.category} onChange={handleSelectChange}>
                  <option>General</option>
                  <option>Sprint Planning</option>
                  <option>Client Meeting</option>
                  <option>Internal Sync</option>
                  <option>Brainstorming</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h3><Zap size={20} /> AI Features</h3>
          <div className="toggle-group">
            <div 
              className={`toggle-item ${config.toggles.actionItems ? 'active' : ''}`}
              onClick={() => toggleOption('actionItems')}
            >
              <span>Extract Action Items</span>
              <div className="toggle-switch"><div className="toggle-thumb" /></div>
            </div>
            <div 
              className={`toggle-item ${config.toggles.speakerId ? 'active' : ''}`}
              onClick={() => toggleOption('speakerId')}
            >
              <span>Speaker Identification</span>
              <div className="toggle-switch"><div className="toggle-thumb" /></div>
            </div>
            <div 
              className={`toggle-item ${config.toggles.keyDecisions ? 'active' : ''}`}
              onClick={() => toggleOption('keyDecisions')}
            >
              <span>Key Decisions</span>
              <div className="toggle-switch"><div className="toggle-thumb" /></div>
            </div>
            <div 
              className={`toggle-item ${config.toggles.sentiment ? 'active' : ''}`}
              onClick={() => toggleOption('sentiment')}
            >
              <span>Sentiment Analysis</span>
              <div className="toggle-switch"><div className="toggle-thumb" /></div>
            </div>
            <div 
              className={`toggle-item ${config.toggles.topicDetection ? 'active' : ''}`}
              onClick={() => toggleOption('topicDetection')}
            >
              <span>Topic Detection</span>
              <div className="toggle-switch"><div className="toggle-thumb" /></div>
            </div>
            <div 
              className={`toggle-item ${config.toggles.riskDetection ? 'active' : ''}`}
              onClick={() => toggleOption('riskDetection')}
            >
              <span>Risk Detection</span>
              <div className="toggle-switch"><div className="toggle-thumb" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="step-actions" style={{ marginTop: '40px' }}>
        <button className="secondary-btn" onClick={onBack}>Back</button>
        <button className="primary-btn" onClick={() => onNext(config)}>Start AI Processing</button>
      </div>
    </div>
  );
};

export default ConfigureStep;
