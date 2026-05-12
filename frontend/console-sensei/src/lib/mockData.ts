export interface Meeting {
  id: number;
  meeting_id: string;
  meeting_title: string;
  meeting_date: string;
  meeting_time: string;
  duration_minutes: number;
  meeting_context: string;
  ai_summary: string | null;
  role_based_summary: string | null;
  custom_summary: string | null;
  participants_count: number;
  docs_generated: number;
  file_type: string;
  uploaded_by: string;
  uploaded_by_email: string;
  created_at: string;
  // keeping status for UI state mapping
  status: 'completed' | 'processing' | 'scheduled';
}

export interface Participant {
  id: number;
  participant_id: string;
  meeting_id: number;
  participant_name: string;
  participant_email: string;
  role: string;
  department: string;
  speaking_time: number | null; // in seconds
  summary_sent: boolean;
  summary_sent_time: string | null;
}

export interface Task {
  id: number;
  task_id: string;
  meeting_id: number;
  role: string;
  task_description: string;
  assigned_to: string;
  assigned_email: string;
  priority: string;
  generated_time: string;
  document_link: string | null;
  // keep status for UI mapping if needed
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface Document {
  id: number;
  doc_id: string;
  meeting_id: number;
  document_name: string;
  document_type: string;
  generated_at: string;
  shared_to_email: string;
  // keeping size for UI
  size: string;
}

export const mockMeetings: Meeting[] = [
  {
    id: 1,
    meeting_id: 'MTG-001',
    meeting_title: 'Q3 Product Strategy Alignment',
    meeting_date: '2023-10-12',
    meeting_time: '10:00:00',
    duration_minutes: 45,
    meeting_context: 'Quarterly alignment on product roadmap and resource allocation.',
    ai_summary: 'Focused on scaling the infrastructure for the new AI features and finalizing the Q3 roadmap. Approved mobile app release date.',
    role_based_summary: null,
    custom_summary: null,
    participants_count: 8,
    docs_generated: 2,
    file_type: 'MP4',
    uploaded_by: 'Sarah Miller',
    uploaded_by_email: 'sarah.m@company.com',
    created_at: '2023-10-12T11:00:00Z',
    status: 'completed'
  },
  {
    id: 2,
    meeting_id: 'MTG-002',
    meeting_title: 'Engineering Sync: Performance Bottlenecks',
    meeting_date: '2023-10-14',
    meeting_time: '14:30:00',
    duration_minutes: 32,
    meeting_context: 'Weekly engineering sync to discuss open issues.',
    ai_summary: 'Analyzing database query latency and front-end bundle size optimization.',
    role_based_summary: null,
    custom_summary: null,
    participants_count: 5,
    docs_generated: 0,
    file_type: 'MP3',
    uploaded_by: 'David Kim',
    uploaded_by_email: 'david.k@company.com',
    created_at: '2023-10-14T15:10:00Z',
    status: 'processing'
  },
  {
    id: 3,
    meeting_id: 'MTG-003',
    meeting_title: 'Marketing & Design Weekly',
    meeting_date: '2023-10-15',
    meeting_time: '09:00:00',
    duration_minutes: 60,
    meeting_context: 'Alignment on upcoming campaigns and asset delivery.',
    ai_summary: null,
    role_based_summary: null,
    custom_summary: null,
    participants_count: 12,
    docs_generated: 0,
    file_type: 'VTT',
    uploaded_by: 'Emma Wilson',
    uploaded_by_email: 'emma.w@company.com',
    created_at: '2023-10-14T16:00:00Z',
    status: 'scheduled'
  }
];

export const mockParticipants: Participant[] = [
  { id: 1, participant_id: 'USR-001', meeting_id: 1, participant_name: 'Alex Chen', participant_email: 'alex.c@company.com', role: 'Product Lead', department: 'Product', speaking_time: 1200, summary_sent: true, summary_sent_time: '2023-10-12T11:05:00Z' },
  { id: 2, participant_id: 'USR-002', meeting_id: 1, participant_name: 'Sarah Miller', participant_email: 'sarah.m@company.com', role: 'Senior Designer', department: 'Design', speaking_time: 800, summary_sent: true, summary_sent_time: '2023-10-12T11:05:00Z' },
  { id: 3, participant_id: 'USR-003', meeting_id: 2, participant_name: 'David Kim', participant_email: 'david.k@company.com', role: 'Backend Engineer', department: 'Engineering', speaking_time: 1500, summary_sent: false, summary_sent_time: null },
  { id: 4, participant_id: 'USR-004', meeting_id: 3, participant_name: 'Emma Wilson', participant_email: 'emma.w@company.com', role: 'Marketing Manager', department: 'Marketing', speaking_time: null, summary_sent: false, summary_sent_time: null }
];

export const mockTasks: Task[] = [
  {
    id: 1,
    task_id: 'TSK-001',
    meeting_id: 1,
    role: 'Owner',
    task_description: 'Finalize Q3 Product Roadmap',
    assigned_to: 'Sarah Miller',
    assigned_email: 'sarah.m@company.com',
    priority: 'High',
    generated_time: '2023-10-12T10:45:00Z',
    document_link: null,
    status: 'In Progress'
  },
  {
    id: 2,
    task_id: 'TSK-002',
    meeting_id: 1,
    role: 'Assignee',
    task_description: 'Sync Notion docs with Engineering',
    assigned_to: 'Alex Chen',
    assigned_email: 'alex.c@company.com',
    priority: 'Medium',
    generated_time: '2023-10-12T10:45:00Z',
    document_link: 'https://notion.so/docs/123',
    status: 'Pending'
  },
  {
    id: 3,
    task_id: 'TSK-003',
    meeting_id: 2,
    role: 'Owner',
    task_description: 'Review Q2 Performance Metrics',
    assigned_to: 'David Kim',
    assigned_email: 'david.k@company.com',
    priority: 'Low',
    generated_time: '2023-10-14T15:00:00Z',
    document_link: null,
    status: 'Completed'
  }
];

export const mockDocuments: Document[] = [
  {
    id: 1,
    doc_id: 'DOC-001',
    meeting_id: 1,
    document_name: 'Q3_Roadmap_Draft.pdf',
    document_type: 'PDF',
    size: '2.4 MB',
    generated_at: '2023-10-12T10:30:00Z',
    shared_to_email: 'team@company.com'
  },
  {
    id: 2,
    doc_id: 'DOC-002',
    meeting_id: 1,
    document_name: 'Meeting_Transcript_Oct12.txt',
    document_type: 'TXT',
    size: '156 KB',
    generated_at: '2023-10-12T11:20:00Z',
    shared_to_email: 'team@company.com'
  }
];
