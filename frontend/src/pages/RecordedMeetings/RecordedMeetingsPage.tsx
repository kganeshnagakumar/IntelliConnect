import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadStep from '../../components/RecordedMeetings/UploadStep';
import ConfigureStep from '../../components/RecordedMeetings/ConfigureStep';
import ProcessingStep from '../../components/RecordedMeetings/ProcessingStep';
import ResultsDashboard from '../../components/RecordedMeetings/ResultsDashboard';
import './RecordedMeetingsPage.css';

export type MeetingData = {
  id?: string;
  meeting_id?: string;
  title: string;
  summary?: string;
  category?: string;
  tasks?: any[];
  participants?: any[];
  transcripts?: any[];
};

const RecordedMeetingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [config, setConfig] = useState({
    summaryStyle: 'Professional',
    language: 'English',
    length: 'Medium',
    category: 'General',
    toggles: {
      actionItems: true,
      speakerId: true,
      keyDecisions: true,
      sentiment: false,
      topicDetection: true,
      riskDetection: false,
    }
  });
  const [processedData, setProcessedData] = useState<MeetingData | null>(null);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    nextStep();
  };

  const handleConfigure = (newConfig: any) => {
    setConfig(newConfig);
    nextStep();
  };

  const handleProcessingComplete = (data: MeetingData) => {
    setProcessedData(data);
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep onUpload={handleUpload} onBack={() => navigate('/dashboard')} />;
      case 2:
        return (
          <ConfigureStep 
            onBack={prevStep} 
            onNext={handleConfigure} 
            initialConfig={config} 
          />
        );
      case 3:
        return (
          <ProcessingStep 
            file={uploadedFile} 
            config={config} 
            onComplete={handleProcessingComplete} 
          />
        );
      case 4:
        return (
          <ResultsDashboard 
            data={processedData} 
            onBack={() => setCurrentStep(2)}
            onNewAnalysis={() => {
              setCurrentStep(1);
              setUploadedFile(null);
              setProcessedData(null);
            }}
          />
        );
      default:
        return <UploadStep onUpload={handleUpload} onBack={() => navigate('/dashboard')} />;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Recorded Meetings</h1>
        <p className="subtitle">AI-powered meeting intelligence pipeline</p>
      </header>
      
      <div className="stepper-container">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`step-item ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && "Upload"}
              {step === 2 && "Configure"}
              {step === 3 && "Process"}
              {step === 4 && "Results"}
            </div>
          </div>
        ))}
      </div>

      <div className="step-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default RecordedMeetingsPage;
