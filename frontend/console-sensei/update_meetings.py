import re

with open(r'c:\Users\AHMED\Downloads\indexpage\console-sensei\src\pages\dashboard\Meetings.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update steps array
content = re.sub(r"const steps = \[\s*\{ id: 1, name: 'Upload', icon: CloudUpload \},\s*\{ id: 2, name: 'Configure', icon: FileVideo \},\s*\{ id: 3, name: 'Processing', icon: BrainCircuit \},\s*\{ id: 4, name: 'Results', icon: CheckCircle \},\s*\];", 
"""const steps = [
  { id: 1, name: 'Upload', icon: CloudUpload },
  { id: 2, name: 'Processing', icon: BrainCircuit },
  { id: 3, name: 'Results', icon: CheckCircle },
];""", content)

# 2. Update nextStep
content = re.sub(r"""  const nextStep = \(\) => \{
    if \(currentStep === 1 && !fileLoaded\) return;
    if \(currentStep === 3 && processingProgress < 100\) return;
    
    if \(currentStep === 2\) \{
      setCurrentStep\(3\);
      startProcessing\(\);
    \} else \{
      setCurrentStep\(prev => Math\.min\(prev \+ 1, 4\)\);
    \}
  \};""",
"""  const nextStep = () => {
    if (currentStep === 1 && !fileLoaded) return;
    if (currentStep === 2 && processingProgress < 100) return;
    
    if (currentStep === 1) {
      setCurrentStep(2);
      startProcessing();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };""", content)

# 3. Update setTimeout(4)
content = content.replace("setCurrentStep(4);", "setCurrentStep(3);")
content = content.replace("Math.min(prev + 1, 4)", "Math.min(prev + 1, 3)")

# 4. Remove Configure block
content = re.sub(r"\{currentStep === 2 && \(\s*<motion\.div\s*key=\"step2\"[\s\S]*?\{currentStep === 3 && \(", "{currentStep === 2 && (", content)

# 5. Shift step 3 -> 2
content = content.replace('key="step3"', 'key="step2"')

# 6. Shift step 4 -> 3
content = content.replace("{currentStep === 4 && (", "{currentStep === 3 && (")
content = content.replace('key="step4"', 'key="step3"')

# 7. Update Footer Status
content = re.sub(r"\{currentStep === 1 && !fileLoaded[\s\S]*?✓ Analysis complete</span>\}\s*</div>", 
"""{currentStep === 1 && !fileLoaded && <span className="text-xs font-bold text-foreground/40">Upload a file to begin</span>}
            {currentStep === 1 && fileLoaded && <span className="text-xs font-bold text-foreground">File ready for processing</span>}
            {currentStep === 2 && <span className="text-xs font-bold text-foreground animate-pulse">Processing... please wait</span>}
            {currentStep === 3 && <span className="text-xs font-bold text-green-500">✓ Analysis complete</span>}
          </div>""", content)

# 8. Update Footer Buttons
content = re.sub(r"\{currentStep > 1 && currentStep < 4[\s\S]*?New Analysis\s*</button>\s*\)\}\s*</div>", 
"""{currentStep === 1 && (
              <button 
                onClick={nextStep} 
                disabled={!fileLoaded}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                  fileLoaded ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-neon-blue" : "bg-foreground/5 text-foreground/20"
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
          </div>""", content)

# 9. Update History Grid Schema Fields
content = content.replace("meeting.title", "meeting.meeting_title")
content = content.replace("meeting.date", "meeting.meeting_date")
content = content.replace("meeting.participants", "meeting.participants_count")
content = content.replace("meeting.summary", "meeting.ai_summary")

with open(r'c:\Users\AHMED\Downloads\indexpage\console-sensei\src\pages\dashboard\Meetings.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
