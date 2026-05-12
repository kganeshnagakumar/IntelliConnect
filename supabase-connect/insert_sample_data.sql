-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS api_meeting (
    id BIGSERIAL PRIMARY KEY,
    meeting_id VARCHAR(100) UNIQUE NOT NULL,
    meeting_title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    meeting_context TEXT NOT NULL,
    ai_summary TEXT,
    role_based_summary TEXT,
    custom_summary TEXT,
    participants_count INTEGER NOT NULL,
    docs_generated INTEGER NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_by_email VARCHAR(254) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS api_participant (
    id BIGSERIAL PRIMARY KEY,
    participant_id VARCHAR(100) UNIQUE NOT NULL,
    meeting_id BIGINT NOT NULL REFERENCES api_meeting(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    participant_email VARCHAR(254) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    speaking_time INTEGER,
    summary_sent BOOLEAN DEFAULT FALSE NOT NULL,
    summary_sent_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS api_task (       
    id BIGSERIAL PRIMARY KEY,
    task_id VARCHAR(100) UNIQUE NOT NULL,
    meeting_id BIGINT NOT NULL REFERENCES api_meeting(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    task_description TEXT NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    assigned_email VARCHAR(254) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    generated_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    document_link VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS api_document (
    id BIGSERIAL PRIMARY KEY,
    doc_id VARCHAR(100) UNIQUE NOT NULL,
    meeting_id BIGINT NOT NULL REFERENCES api_meeting(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    shared_to_email VARCHAR(254) NOT NULL
);
