import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { supabase, getAuthToken } from "../../lib/supabase";
import { 
  Upload, 
  FileVideo, 
  BrainCircuit, 
  CheckCircle, 
  ChevronRight,
  Video,
  Clock,
  Users,
  Search,
  MoreHorizontal,
  CloudUpload,
  FileText,
  FileAudio,
  Check,
  Cpu,
  Layers,
  Fingerprint,
  FileCheck2,
  Copy,
  Share,
  DownloadCloud,
  FileDown
} from "lucide-react";
import { cn } from "../../lib/utils";

// ─── PDF Export Helper ────────────────────────────────────────────────────────
const exportMeetingToPDF = async (meeting: any) => {
  // Dynamically import jsPDF so it doesn't bloat initial bundle
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const analysis = meeting.ai_analysis || {};
  const title = meeting.title || "Untitled Meeting";
  const date = new Date(meeting.created_at).toLocaleString();
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = margin;

  const addPage = () => { doc.addPage(); y = margin; };
  const checkY = (needed = 12) => { if (y + needed > 280) addPage(); };

  // Header bar
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageW, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("IntelliConnect · Meeting Report", margin, 14);
  y = 30;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(title, contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8 + 2;

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${date}`, margin, y);
  y += 10;

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Section helper
  const addSection = (heading: string, body: string | null) => {
    if (!body) return;
    checkY(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(heading.toUpperCase(), margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const cleaned = body.replace(/^#+\s/gm, "").trim();
    const lines = doc.splitTextToSize(cleaned, contentW);
    lines.forEach((line: string) => {
      checkY(6);
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 4;
  };

  addSection("Summary", analysis.context_summary);

  // Action Items
  if (analysis.personalized_tasks?.length) {
    checkY(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text("ACTION ITEMS", margin, y);
    y += 6;
    analysis.personalized_tasks.forEach((task: any, idx: number) => {
      checkY(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${task.person_name || "Assignee"}`, margin + 2, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const taskLines = doc.splitTextToSize(task.task_description || "", contentW - 6);
      taskLines.forEach((l: string) => { checkY(5); doc.text(l, margin + 4, y); y += 5; });
      if (task.priority) {
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Priority: ${task.priority}${task.deadline ? "  ·  Due: " + task.deadline : ""}`, margin + 4, y);
        y += 5;
      }
      y += 2;
    });
    y += 2;
  }

  // Role Insights
  if (analysis.role_summaries?.length) {
    checkY(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text("ROLE INSIGHTS", margin, y);
    y += 6;
    analysis.role_summaries.forEach((r: any) => {
      checkY(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(r.role_name || "Role", margin + 2, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const rLines = doc.splitTextToSize(r.summary_content || "", contentW - 4);
      rLines.forEach((l: string) => { checkY(5); doc.text(l, margin + 4, y); y += 5; });
      y += 3;
    });
  }

  // Footer on every page
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`IntelliConnect · Page ${p} of ${totalPages}`, margin, 292);
  }

  const safeName = title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
  doc.save(`${safeName}.pdf`);
};

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const steps = [
  { id: 1, name: 'Upload', icon: CloudUpload },
  { id: 2, name: 'Processing', icon: BrainCircuit },
  { id: 3, name: 'Results', icon: CheckCircle },
];

const STAGES = [
  { id: 1, name: "File Upload & Validation", desc: "Verifying format and integrity", duration: 800 },
  { id: 2, name: "Speech-to-Text Conversion", desc: "Transcribing audio into raw text", duration: 2000 },
  { id: 3, name: "Speaker Diarization", desc: "Identifying and labeling speakers", duration: 1500 },
  { id: 4, name: "AI Summarization", desc: "Generating insights with Gemini/Claude", duration: 2500 },
  { id: 5, name: "Report Generation", desc: "Compiling final structured output", duration: 800 }
];

export default function Meetings() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Processing state
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0); 
  
  // Results state
  const [resultTab, setResultTab] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMeetings();
    
    // Close dropdown menu when clicking anywhere
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${API_BASE}/api/meetings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(response.data.results || []);
    } catch (error) {
      console.error("Failed to fetch meetings", error);
    }
  };

  const handleDeleteMeeting = async (id: string, e: any) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      const token = await getAuthToken();
      await axios.delete(`${API_BASE}/api/meetings/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMeetings();
    } catch (error) {
      console.error("Failed to delete meeting", error);
      alert("Failed to delete meeting.");
    }
  };

  const handleRenameMeeting = async (meeting: any, e: any) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newTitle = window.prompt("Enter new meeting title:", meeting.title);
    if (newTitle && newTitle.trim() !== meeting.title) {
      try {
        const token = await getAuthToken();
        await axios.patch(`${API_BASE}/api/meetings/${meeting.id}/`, { title: newTitle.trim() }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMeetings();
      } catch (error) {
        console.error("Failed to rename meeting", error);
        alert("Failed to rename meeting.");
      }
    }
  };

  const handleViewMeeting = (meeting: any, e: any) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setAnalysisResult({ ...meeting.ai_analysis, meetingId: meeting.id, meeting_title: meeting.title });
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSummary = async () => {
    if (!analysisResult?.meetingId) return;
    setIsSavingSummary(true);
    try {
      const token = await getAuthToken();
      await axios.patch(`${API_BASE}/api/meetings/${analysisResult.meetingId}/update_summary/`, {
        context_summary: analysisResult.context_summary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditingSummary(false);
      fetchMeetings();
    } catch (error) {
      console.error("Failed to save summary", error);
      alert("Failed to save summary.");
    } finally {
      setIsSavingSummary(false);
    }
  };

  const handleTaskEmailChange = (index: number, email: string) => {
    const updatedTasks = [...analysisResult.personalized_tasks];
    updatedTasks[index].email = email;
    setAnalysisResult({ ...analysisResult, personalized_tasks: updatedTasks });
  };

  const handleSubmitAnalysis = async () => {
    if (!analysisResult?.meetingId) return;
    setIsSubmitting(true);
    try {
      const token = await getAuthToken();
      await axios.patch(`${API_BASE}/api/meetings/${analysisResult.meetingId}/save_analysis/`, {
        context_summary: analysisResult.context_summary,
        personalized_tasks: analysisResult.personalized_tasks
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Analysis submitted and saved to database!");
      fetchMeetings();
    } catch (error) {
      console.error("Failed to submit analysis", error);
      alert("Failed to submit analysis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: any) => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const startProcessing = async () => {
    if (!file) return;

    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('title', file.name.split('.')[0]);
      formData.append('file', file);

      // 1. Initial Upload
      setActiveStage(1);
      setProcessingProgress(10);
      
      const response = await axios.post(`${API_BASE}/api/meetings/`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      // 2. Poll for status
      const meetingId = response.data.id;
      pollStatus(meetingId);

    } catch (error: any) {
      console.error("Upload failed", error);
      const errorMsg = error.response?.data?.error || error.message || "Unknown error";
      alert(`Upload failed: ${errorMsg}`);
      resetAll();
    }
  };

  const pollStatus = (id: string) => {
    let retryCount = 0;
    const maxRetries = 5;

    const interval = setInterval(async () => {
      try {
        const token = await getAuthToken();
        const response = await axios.get(`${API_BASE}/api/meetings/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Reset retry count on success
        retryCount = 0;

        const status = response.data.uploaded_file?.processing_status?.toLowerCase() || 'pending';
        const logs = response.data.processing_logs || [];
        const lastLog = logs[logs.length - 1];
        
        // Map backend stages to UI stages
        if (lastLog) {
          if (lastLog.stage === 'PIPELINE' && lastLog.status === 'STARTED') setActiveStage(1);
          if (lastLog.stage === 'TRANSCRIPTION') setActiveStage(2);
          if (lastLog.stage === 'ANALYSIS') setActiveStage(4);
        }

        if (status === 'completed') {
          setProcessingProgress(100);
          setActiveStage(6);
          setAnalysisResult({ ...response.data.ai_analysis, meetingId: id, meeting_title: file?.name });
          clearInterval(interval);
          setTimeout(() => setCurrentStep(3), 500);
          fetchMeetings();
        } else if (status === 'failed') {
          clearInterval(interval);
          alert("Processing failed: " + (response.data.uploaded_file?.error_message || "Unknown error"));
          resetAll();
        } else {
          setProcessingProgress(prev => {
            // Slower, more realistic progress that waits for the actual status
            if (prev < 30) return prev + 5;
            if (prev < 60) return prev + 2;
            if (prev < 90) return prev + 0.5;
            return prev;
          });
        }
      } catch (error) {
        retryCount++;
        console.error(`Polling attempt ${retryCount} failed:`, error);
        if (retryCount >= maxRetries) {
          clearInterval(interval);
          alert("Network connection lost. Please check your internet and refresh.");
        }
      }
    }, 4000); // Increased to 4s to reduce server load
  };

  const nextStep = () => {
    if (currentStep === 1 && !file) return;
    if (currentStep === 2 && processingProgress < 100) return;
    
    if (currentStep === 1) {
      setCurrentStep(2);
      startProcessing();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const resetAll = () => {
    setFile(null);
    setProcessingProgress(0);
    setActiveStage(0);
    setResultTab(0);
    setCurrentStep(1);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Meetings</h1>
          <p className="text-foreground/50 font-medium">Manage and analyze your recorded conversations.</p>
        </motion.div>
      </div>

      {/* Stepper Flow */}
      <div className="glass-card rounded-[2.5rem] p-10 overflow-hidden relative">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-foreground/5 -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-0 h-[2px] bg-brand-blue -translate-y-1/2 z-0"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted ? "var(--color-brand-blue)" : isActive ? "var(--background)" : "var(--background)",
                    borderColor: isCompleted || isActive ? "var(--color-brand-blue)" : "rgba(0,0,0,0.1)"
                  }}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors shadow-xl",
                    isActive && "shadow-brand-blue/20",
                    isCompleted ? "text-white" : isActive ? "text-brand-blue" : "text-foreground/20"
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </motion.div>
                <span className={cn(
                  "absolute -bottom-7 text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                  isActive ? "text-foreground" : "text-foreground/30"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[440px] flex flex-col max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col gap-6"
              >
                <div 
                  className={cn(
                    "w-full rounded-[2rem] flex flex-col items-center justify-center gap-6 cursor-pointer relative overflow-hidden transition-all duration-300",
                    file ? "border-brand-blue/50 bg-brand-blue/[0.02]" : "border-2 border-dashed hover:border-brand-blue/40",
                    isDragOver ? "border-brand-blue bg-brand-blue/[0.05] scale-[1.01]" : "border-foreground/10",
                    file ? "p-8" : "p-16"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e); }}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  {!file ? (
                    <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center cursor-pointer">
                      <div className="w-20 h-20 rounded-3xl bg-brand-blue/10 flex items-center justify-center shadow-inner mb-6">
                        <Upload className="w-10 h-10 text-brand-blue" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Drop your file here</h3>
                        <p className="text-foreground/40 font-medium mb-6">Drag and drop, or click to browse</p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                          {['.VTT', '.TXT', '.PDF', '.MP4', '.MP3'].map(ext => (
                            <span key={ext} className="px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-[10px] font-black tracking-widest text-foreground/50">
                              {ext}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center gap-5 w-full max-w-md bg-foreground/[0.03] p-4 rounded-2xl border border-foreground/5">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                        {file.type.includes('video') ? <FileVideo className="w-6 h-6" /> : <FileAudio className="w-6 h-6" />}
                      </div>
                      <div className="flex-grow min-w-0 text-left">
                        <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-foreground/40 font-medium mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-green-500 font-bold text-xs shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Ready
                      </div>
                      <button onClick={() => setFile(null)} className="text-xs font-bold text-foreground/20 hover:text-red-500 transition-colors ml-2">Remove</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col gap-8 max-w-2xl mx-auto"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-black tracking-tight mb-2">Analyzing Meeting...</h3>
                  <p className="text-foreground/40 font-medium">AI is transcribing and extracting intelligence from your meeting.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Overall Progress</span>
                    <span className="text-brand-blue">{processingProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-brand-blue to-cyan-glow"
                      animate={{ width: `${processingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {STAGES.map((stage) => {
                    const status = activeStage > stage.id ? 'done' : activeStage === stage.id ? 'running' : 'pending';
                    const Icon = stage.id === 1 ? CheckCircle : stage.id === 2 ? FileText : stage.id === 3 ? Users : stage.id === 4 ? Cpu : FileCheck2;
                    
                    return (
                      <div key={stage.id} className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                        status === 'running' ? "bg-brand-blue/[0.03] border-brand-blue/30" : 
                        status === 'done' ? "bg-green-500/[0.03] border-green-500/20" : "bg-foreground/[0.01] border-foreground/5"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          status === 'running' ? "bg-brand-blue/10 text-brand-blue animate-pulse" :
                          status === 'done' ? "bg-green-500/10 text-green-500" : "bg-foreground/5 text-foreground/20"
                        )}>
                          {status === 'done' ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <div className="flex-grow text-left">
                          <p className="text-sm font-bold">{stage.name}</p>
                          <p className="text-xs font-medium text-foreground/40">{stage.desc}</p>
                        </div>
                        <div className="shrink-0 text-xs font-black tracking-widest uppercase">
                          {status === 'done' ? <span className="text-green-500">✓</span> :
                           status === 'running' ? <span className="text-brand-blue animate-pulse">Running</span> : 
                           <span className="text-foreground/20">—</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && analysisResult && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col gap-6"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-foreground/5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-brand-blue/20 border border-green-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black tracking-tight mb-1">Analysis Complete</h3>
                    <p className="text-sm font-medium text-foreground/40">{file?.name || analysisResult?.meeting_title}</p>
                  </div>
                </div>

                <div className="flex gap-2 bg-foreground/[0.02] p-1.5 rounded-xl border border-foreground/5">
                  {['Summary', 'Action Items', 'Roles'].map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setResultTab(i)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                        resultTab === i ? "bg-background shadow text-foreground" : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="min-h-[280px] p-6 glass rounded-2xl border border-foreground/5 text-left">
                  {resultTab === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Context Summary</h4>
                          {isEditingSummary ? (
                            <button 
                              onClick={handleSaveSummary} 
                              disabled={isSavingSummary} 
                              className="text-xs font-bold text-brand-blue bg-brand-blue/10 hover:bg-brand-blue/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {isSavingSummary ? "Saving..." : "Save Changes"}
                            </button>
                          ) : (
                            <button 
                              onClick={() => setIsEditingSummary(true)} 
                              className="text-xs font-bold text-foreground/40 hover:text-brand-blue px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors"
                            >
                              Edit Summary
                            </button>
                          )}
                        </div>
                        {isEditingSummary ? (
                          <textarea 
                            value={analysisResult.context_summary}
                            onChange={(e) => setAnalysisResult({...analysisResult, context_summary: e.target.value})}
                            className="w-full min-h-[200px] p-4 bg-foreground/[0.02] border border-foreground/10 rounded-xl text-sm font-medium text-foreground/80 leading-relaxed focus:ring-1 focus:ring-brand-blue resize-y"
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground/60 leading-relaxed whitespace-pre-wrap">
                            {analysisResult.context_summary.replace(/^#+\s/gm, '')}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                  {resultTab === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h4 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Personalized Tasks</h4>
                      <div className="space-y-4">
                        {analysisResult.personalized_tasks?.map((item: any, i: number) => (
                          <div key={i} className="flex flex-col gap-3 p-4 bg-foreground/[0.02] border border-foreground/5 rounded-2xl text-sm transition-all hover:border-brand-blue/20">
                            <div className="flex gap-3">
                              <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                              <div className="flex-grow">
                                <p className="text-foreground/80 font-bold mb-1">{item.person_name}</p>
                                <p className="text-foreground/60 font-medium leading-relaxed">{item.task_description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase">{item.priority}</span>
                                  {item.deadline && <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Due: {item.deadline}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-foreground/5">
                              <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Assignee Email</label>
                              <input 
                                type="email" 
                                placeholder="Enter email to assign..."
                                value={item.email || ""}
                                onChange={(e) => handleTaskEmailChange(i, e.target.value)}
                                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:ring-1 focus:ring-brand-blue transition-all"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {resultTab === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h4 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Role-Based Insights</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {analysisResult.role_summaries?.map((p: any, i: number) => (
                          <div key={i} className="flex flex-col p-5 bg-foreground/[0.02] border border-foreground/5 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0 bg-brand-blue/10 text-brand-blue">{p.role_name?.[0] || 'R'}</div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{p.role_name}</p>
                              </div>
                            </div>
                            <p className="text-xs font-medium text-foreground/60 leading-relaxed">{p.summary_content}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-foreground/5">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-bold text-foreground/70 transition-colors">
                    <Copy className="w-4 h-4" /> Copy Summary
                  </button>
                  <button 
                    onClick={handleSubmitAnalysis}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-black shadow-lg shadow-brand-blue/20 hover:bg-neon-blue transition-all ml-auto disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> {isSubmitting ? "Submitting..." : "Submit Analysis"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-foreground/5 max-w-4xl mx-auto">
          <div>
            {currentStep === 1 && !file && <span className="text-xs font-bold text-foreground/40">Upload a file to begin</span>}
            {currentStep === 1 && file && <span className="text-xs font-bold text-foreground">File ready for processing</span>}
            {currentStep === 2 && <span className="text-xs font-bold text-foreground animate-pulse">Processing... please wait</span>}
            {currentStep === 3 && <span className="text-xs font-bold text-green-500">✓ Analysis complete</span>}
          </div>
          <div className="flex items-center gap-3">
            {currentStep === 1 && (
              <button 
                onClick={nextStep} 
                disabled={!file}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                  file ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-neon-blue" : "bg-foreground/5 text-foreground/20"
                )}
              >
                Analyze Meeting →
              </button>
            )}
            {currentStep === 3 && (
              <button 
                onClick={resetAll} 
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-neon-blue transition-all"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">Meeting History</h2>
          <div className="relative group w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input 
              type="text" 
              placeholder="Filter meetings..." 
              className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl pl-12 pr-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting, i) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass-card rounded-[2rem] p-8 flex flex-col gap-6 relative group cursor-pointer hover:-translate-y-1 transition-transform",
                activeMenuId === meeting.id ? "z-40 shadow-2xl ring-1 ring-brand-blue/20" : "z-10"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-foreground/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  <Video className="w-6 h-6" />
                </div>
                <div className="relative z-50">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === meeting.id ? null : meeting.id); }}
                    className={cn(
                      "p-2 rounded-lg transition-colors relative",
                      activeMenuId === meeting.id ? "bg-brand-blue/10 text-brand-blue" : "hover:bg-foreground/5 text-foreground/20 hover:text-brand-blue"
                    )}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenuId === meeting.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 bg-background border border-foreground/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-3 flex flex-col z-[100] overflow-hidden"
                      >
                        <button 
                          onClick={(e) => handleViewMeeting(meeting, e)} 
                          className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-brand-blue/10 hover:text-brand-blue flex items-center gap-4 transition-all"
                        >
                          <FileText className="w-4 h-4" /> View Details
                        </button>
                        <button 
                          onClick={(e) => handleRenameMeeting(meeting, e)} 
                          className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-brand-blue/10 hover:text-brand-blue flex items-center gap-4 transition-all"
                        >
                          <Cpu className="w-4 h-4" /> Rename
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); exportMeetingToPDF(meeting); }} 
                          className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-brand-blue/10 hover:text-brand-blue flex items-center gap-4 transition-all"
                        >
                          <FileDown className="w-4 h-4" /> Export PDF
                        </button>
                        <div className="w-full h-px bg-foreground/5 my-2" />
                        <button 
                          onClick={(e) => handleDeleteMeeting(meeting.id, e)} 
                          className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 flex items-center gap-4 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black mb-2 group-hover:text-brand-blue transition-colors line-clamp-1">{meeting.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(meeting.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {meeting.uploaded_file?.processing_status || 'PENDING'}</span>
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-sm text-foreground/50 line-clamp-2 font-medium leading-relaxed">
                  {meeting.ai_analysis?.context_summary?.replace(/^#+\s/gm, '') || "No summary available for this session."}
                </p>
              </div>

              <div className="pt-6 border-t border-foreground/5 flex items-center justify-between">
                <div className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  meeting.uploaded_file?.processing_status === 'COMPLETED' ? "bg-green-500/10 text-green-500" :
                  meeting.uploaded_file?.processing_status === 'PROCESSING' ? "bg-brand-blue/10 text-brand-blue" :
                  "bg-foreground/5 text-foreground/30"
                )}>
                  {meeting.uploaded_file?.processing_status || 'PENDING'}
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/10 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </div>

              {/* Holographic Border Effect */}
              <div className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-brand-blue/20 transition-all pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
