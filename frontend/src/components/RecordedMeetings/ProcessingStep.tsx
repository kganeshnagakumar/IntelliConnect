import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Loader2,
  FileCheck,
  Mic,
  Users,
  Brain,
  FileOutput
} from 'lucide-react';
import './RecordedMeetings.css';

interface ProcessingStepProps {
  onComplete: (data: any) => void;
  file: File;
  config: any;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ onComplete, file, config }) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { id: 'stage1', label: 'File Upload & Validation', desc: 'Verifying format and integrity', icon: <FileCheck size={18} /> },
    { id: 'stage2', label: 'Speech-to-Text Conversion', desc: 'Transcribing audio into raw text', icon: <Mic size={18} /> },
    { id: 'stage3', label: 'Speaker Diarization', desc: 'Identifying and labeling speakers', icon: <Users size={18} /> },
    { id: 'stage4', label: 'AI Summarization', desc: 'Generating insights with AI', icon: <Brain size={18} /> },
    { id: 'stage5', label: 'Report Generation', desc: 'Compiling final structured output', icon: <FileOutput size={18} /> },
  ];

  useEffect(() => {
    let isMounted = true;
    let interval: ReturnType<typeof setInterval>;
    
    const startProcessing = async () => {
      // Fake progress up to 90%
      let currentProgress = 0;
      interval = setInterval(() => {
        if (!isMounted) return;
        currentProgress += 1;
        // Slow down progress as it reaches 90%
        if (currentProgress > 90) currentProgress = 90;
        
        setProgress(currentProgress);
        const stageIndex = Math.min(Math.floor((currentProgress / 100) * stages.length), stages.length - 1);
        setCurrentStage(stageIndex);
      }, 300); // Slower interval for realistic waiting time

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', config.category || 'General');
        formData.append('settings', JSON.stringify(config));

        const response = await fetch(`${backendUrl}/api/meetings/process_meeting/`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'API request failed');
        }
        
        const data = await response.json();
        let resultData = data;

        if (response.status === 202 && data.job_id) {
          let state = 'PENDING';
          while (isMounted && state !== 'SUCCESS') {
            const statusResponse = await fetch(`${backendUrl}/api/meetings/process_status/?job_id=${encodeURIComponent(data.job_id)}`);
            if (!statusResponse.ok) {
              const statusError = await statusResponse.json().catch(() => ({}));
              throw new Error(statusError.error || 'Failed to fetch processing status');
            }

            const statusData = await statusResponse.json();
            state = statusData.state;

            if (state === 'SUCCESS') {
              resultData = statusData.result;
              break;
            }

            if (state === 'FAILURE') {
              throw new Error(statusData.error || 'Meeting processing failed');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        
        if (isMounted) {
          clearInterval(interval);
          setProgress(100);
          setCurrentStage(stages.length - 1);
          setTimeout(() => onComplete(resultData), 500);
        }
      } catch (error: any) {
        console.error("Processing failed", error);
        if (isMounted) {
          clearInterval(interval);
          alert(`Error: ${error.message || "An error occurred during processing."}`);
        }
      }
    };

    startProcessing();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="processing-panel">
      <div className="panel-heading-centered">
        <h3>Analyzing Meeting...</h3>
        <p>AI is transcribing and extracting intelligence from your meeting.</p>
      </div>

      <div className="progress-section-premium">
        <div className="progress-header-row">
          <span className="progress-label-main">Overall Progress</span>
          <span className="progress-pct-main">{Math.round(progress)}%</span>
        </div>
        <div className="progress-track-main">
          <motion.div 
            className="progress-bar-main"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="process-stages-list">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStage || progress === 100;
          const isActive = index === currentStage && progress < 100;

          return (
            <div key={stage.id} className={`stage-row ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="stage-icon-wrap">
                {isCompleted ? (
                  <CheckCircle size={20} color="#10b981" />
                ) : isActive ? (
                  <Loader2 size={20} className="spin" color="var(--primary)" />
                ) : (
                  <Circle size={20} color="var(--border)" />
                )}
              </div>
              <div className="stage-body">
                <div className="stage-label-main">{stage.label}</div>
                <div className="stage-desc-main">{stage.desc}</div>
              </div>
              {isActive && (
                <div className="stage-tag">In Progress</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingStep;
