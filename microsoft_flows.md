# Microsoft Power Automate Flows Documentation

## 📌 Project Overview

This project implements an automated enterprise workflow using:

- Supabase PostgreSQL Database
- Microsoft Power Automate
- SharePoint Document Library
- SharePoint Lists
- Outlook Email Automation

The system automates PDF/file processing, metadata storage, SharePoint synchronization, and automated email notifications.

---

# 🏗️ System Architecture

```text
User Upload / Manual Trigger
            │
            ▼
     Power Automate PDF Flow
            │
            ▼
   Supabase PostgreSQL Database
            │
            ▼
      HTTP API Requests
            │
            ▼
        Parse JSON Data
            │
            ▼
   SharePoint Document Library
            │
            ▼
    Update SharePoint Metadata
            │
            ▼
      SharePoint List Trigger
            │
            ▼
      Outlook Email Flow
            │
            ▼
     Dynamic Email Delivery
```
