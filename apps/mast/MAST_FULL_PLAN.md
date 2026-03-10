# MAST (Management Assessment and Systems Tool) - Full Planning Document

> **Project:** MAST Phase 1 Automation
> **Client:** (Council/Government Client - ERIC Reporting)
> **Date:** March 2026
> **Version:** 1.0
> **Status:** Ready for Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Brief](#2-brief)
3. [Product Requirements](#3-product-requirements)
4. [Architecture](#4-architecture)
5. [Epics & Stories](#5-epics--stories)
6. [Sprint Plan](#6-sprint-plan)

---

## 1. Executive Summary

### What is MAST?

**MAST (Management Assessment and Systems Tool)** is a web-based platform designed to automate the ERIC (Evidence, Research, Innovation, Impact, Outcomes) reporting process for local government clients.

### Key Objectives:
- Automate ERIC reporting workflow
- Enable Excel data upload by non-technical users
- Provide role-based access (Admin, Contributors, Viewers)
- Generate automated reports from database

### Current State:
- Manual data entry via Excel
- No automated processing
- Limited access control
- Reports generated manually

### Target State:
- Excel file upload capability
- Formula automation in database
- Three-tier permission system
- Automated report generation
- Standalone Supabase database

---

## 2. Brief

### 2.1 Project Overview

| Item | Details |
|------|---------|
| **Project Name** | MAST (Management Assessment and Systems Tool) |
| **Client** | Council/Government (ERIC Reporting) |
| **Start Date** | March 2026 |
| **Target Completion** | March 13, 2026 (Phase 1) |

### 2.2 Problem Statement

Currently, the ERIC reporting process is manual and time-consuming:
- Data contributors input data via Excel files manually
- Administrators review and validate data manually
- Reports are generated manually from Excel
- No automated processing of Excel formulas
- No proper role-based access control

### 2.3 Solution Overview

MAST Phase 1 will provide:
1. **Authentication System** - Secure login with role-based access
2. **Excel Upload** - Upload Excel files with automatic parsing
3. **Data Processing** - Automated formula replication in database
4. **Reporting** - Automated report generation

### 2.4 Phase 1 Deliverables

| Category | Deliverable |
|----------|-------------|
| **Database** | Schema mapped with entities |
| **Themes** | Six custom management themes |
| **Risk Domains** | 19 risk domains identified |
| **Reports** | Report structure finalized |
| **Automation** | Scripts for data processing |
| **Workflow** | Current workflow documented |

### 2.5 Timeline

| Milestone | Date |
|-----------|------|
| Project Setup | March 8 |
| Core Auth | March 9 |
| Excel Upload | March 10 |
| Data Processing | March 11 |
| Reporting | March 12 |
| Phase 1 Testing | March 13 |

### 2.6 Dependencies & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex Excel formulas | High | Early prototype testing |
| Data migration | Medium | Detailed mapping process |
| Client availability | Medium | Async communication |
| Timeline pressure | Medium | Prioritize Phase 1 scope |

---

## 3. Product Requirements

### 3.1 Target Users

| Role | Description | Permissions |
|------|-------------|-------------|
| **Administrator** | Full system access | All CRUD, user management, settings |
| **Data Contributor** | Upload and manage data | Upload files, create/edit data, generate reports |
| **Viewer** | Read-only access | View data and reports only |

### 3.2 User Stories

#### Authentication & Access
| ID | User Story | Priority |
|----|------------|----------|
| US-001 | As an Administrator, I want to log in with credentials so that I can access the system securely | Must Have |
| US-002 | As a Data Contributor, I want to log in so that I can upload and manage data | Must Have |
| US-003 | As a Viewer, I want to log in so that I can view reports | Must Have |
| US-004 | As an Administrator, I want to manage user roles so that I can control access | Must Have |

#### Data Upload
| ID | User Story | Priority |
|----|------------|----------|
| US-005 | As a Data Contributor, I want to upload Excel files so that I can input data | Must Have |
| US-006 | As a Data Contributor, I want to validate my data before submission so that errors are caught early | Should Have |
| US-007 | As a Data Contributor, I want to see upload progress so that I know the system is working | Could Have |

#### Data Processing
| ID | User Story | Priority |
|----|------------|----------|
| US-008 | As a system, I want to replicate Excel formulas in the database so that calculations are automated | Must Have |
| US-009 | As a system, I want to process uploaded data automatically so that reports are up-to-date | Must Have |
| US-010 | As a Data Contributor, I want to map my data to entities so that it's properly organized | Must Have |

#### Reporting
| ID | User Story | Priority |
|----|------------|----------|
| US-011 | As a Viewer, I want to view generated reports so that I can analyze the data | Must Have |
| US-012 | As a Data Contributor, I want to export reports to PDF so that I can share them | Should Have |
| US-013 | As an Administrator, I want to customize report templates so that they meet client needs | Could Have |

### 3.3 Functional Requirements

#### Authentication
| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | Login Page | User authentication with email/password |
| FR-002 | Session Management | Maintain session with secure cookies |
| FR-003 | Logout | Clear session on logout |
| FR-004 | Password Reset | Allow password reset flow |

#### Role Management
| ID | Requirement | Description |
|----|-------------|-------------|
| FR-005 | Role Assignment | Assign Admin/Contributor/Viewer roles |
| FR-006 | Role Permissions | Enforce permission based on role |
| FR-007 | User CRUD | Create, Read, Update, Delete users |

#### Excel Upload
| ID | Requirement | Description |
|----|-------------|-------------|
| FR-008 | File Upload | Accept .xlsx, .xls, .csv files |
| FR-009 | File Validation | Validate file format and structure |
| FR-010 | Data Parsing | Parse Excel data into database records |
| FR-011 | Template Download | Provide Excel template for data entry |

#### Data Processing
| ID | Requirement | Description |
|----|-------------|-------------|
| FR-012 | Formula Replication | Convert Excel formulas to database queries |
| FR-013 | Data Mapping | Map uploaded data to defined entities |
| FR-014 | Data Validation | Validate data against business rules |
| FR-015 | Error Handling | Report errors to user clearly |

#### Reporting
| ID | Requirement | Description |
|----|-------------|-------------|
| FR-016 | Report Generation | Generate reports from database |
| FR-017 | Dashboard | Visual overview of key metrics |
| FR-018 | PDF Export | Export reports to PDF format |
| FR-019 | Excel Export | Export raw data to Excel |

### 3.4 Database Schema

```
Users (extends Supabase Auth)
├── id (UUID)
├── organization_id (FK)
├── email (string)
├── full_name (string)
├── role (enum: admin, contributor, viewer)
├── avatar_url (string)
├── created_at (timestamp)
└── updated_at (timestamp)

Organizations
├── id (UUID)
├── name (string)
├── slug (string)
├── settings (JSONB)
├── created_at (timestamp)
└── updated_at (timestamp)

Management Themes
├── id (UUID)
├── organization_id (FK)
├── name (string)
├── description (text)
├── order_index (integer)
├── is_active (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

Risk Domains
├── id (UUID)
├── organization_id (FK)
├── theme_id (FK)
├── name (string)
├── description (text)
├── order_index (integer)
├── is_active (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

Data Records
├── id (UUID)
├── organization_id (FK)
├── risk_domain_id (FK)
├── period (string)
├── value (numeric)
├── notes (text)
├── uploaded_by (FK)
├── validated_by (FK)
├── is_validated (boolean)
├── uploaded_at (timestamp)
├── validated_at (timestamp)
└── updated_at (timestamp)

Excel Uploads
├── id (UUID)
├── organization_id (FK)
├── user_id (FK)
├── filename (string)
├── file_size (integer)
├── status (enum: pending, processing, completed, failed)
├── record_count (integer)
├── error_message (text)
├── uploaded_at (timestamp)
└── processed_at (timestamp)

Reports
├── id (UUID)
├── organization_id (FK)
├── name (string)
├── type (string)
├── config (JSONB)
├── generated_by (FK)
├── file_path (string)
└── generated_at (timestamp)

Audit Logs
├── id (UUID)
├── organization_id (FK)
├── user_id (FK)
├── action (string)
├── entity_type (string)
├── entity_id (UUID)
├── details (JSONB)
├── ip_address (string)
└── created_at (timestamp)
```

### 3.5 Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Processing | xlsx (SheetJS) |
| PDF Generation | @react-pdf/renderer |
| Deployment | Vercel |

---

## 4. Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Admin UI   │  │ Contributor │  │  Viewer UI  │             │
│  │             │  │    UI       │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Next.js 16 (App Router) + Authentication Middleware   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│   Supabase      │ │   Supabase      │ │   External Services     │
│   Auth          │ │   Database      │ │   - Excel (xlsx)        │
│   (Auth)        │ │   (Data)        │ │   - PDF Generator       │
└─────────────────┘ └─────────────────┘ └─────────────────────────┘
```

### 4.2 API Design

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Auth |
| GET | `/api/auth/me` | Get current user | Auth |
| GET | `/api/users` | List users | Admin |
| POST | `/api/users` | Create user | Admin |
| POST | `/api/uploads` | Upload Excel file | Contributor |
| GET | `/api/uploads` | List uploads | Contributor |
| GET | `/api/data` | Get data records | Contributor |
| POST | `/api/data` | Create data record | Contributor |
| GET | `/api/reports` | List reports | Viewer |
| POST | `/api/reports` | Generate report | Contributor |

### 4.3 Security Architecture

#### Authentication Flow
```
User Login Flow:
1. User enters email/password
2. Client sends to Supabase Auth
3. Supabase validates credentials
4. JWT token returned to client
5. Client stores token in cookies
6. Subsequent requests include token
7. Server validates token via middleware
```

#### Authorization Rules

| Role | Permissions |
|------|-------------|
| **Admin** | Full CRUD on all entities, user management, settings |
| **Contributor** | Upload files, create/edit data records, generate reports |
| **Viewer** | Read-only access to data and reports |

### 4.4 Excel Processing Pipeline

```
1. User uploads Excel file
2. Server validates file type/size
3. File stored in Supabase Storage
4. Upload record created in DB (status: pending)
5. Background job triggered
6. Excel parsed using xlsx library
7. Data validated against schema
8. Formulas extracted and converted
9. Records inserted/updated in DB
10. Upload record updated (status: completed)
11. User notified of success/failure
```

---

## 5. Epics & Stories

### Epic 1: Authentication & Authorization (17 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 1.1 | Setup Supabase project and configure auth | Must | 3 |
| 1.2 | Create login page with email/password | Must | 2 |
| 1.3 | Implement session management with cookies | Must | 3 |
| 1.4 | Create user profile table and RLS policies | Must | 5 |
| 1.5 | Implement role-based route protection | Must | 3 |
| 1.6 | Create logout functionality | Must | 1 |

### Epic 2: User Management (Admin) (21 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 2.1 | Create admin user management page | Must | 5 |
| 2.2 | Implement user creation form | Must | 3 |
| 2.3 | Implement user editing (role, details) | Must | 3 |
| 2.4 | Implement user deletion | Should | 2 |
| 2.5 | Add user invitation via email | Could | 5 |
| 2.6 | Create user activity audit log view | Should | 3 |

### Epic 3: Organization & Data Structure (23 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 3.1 | Create organization settings page | Must | 5 |
| 3.2 | Implement management themes CRUD | Must | 5 |
| 3.3 | Implement risk domains CRUD | Must | 5 |
| 3.4 | Create drag-and-drop reordering | Should | 3 |
| 3.5 | Add theme/domain import from Excel | Could | 5 |

### Epic 4: Excel File Upload (26 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 4.1 | Create file upload component | Must | 3 |
| 4.2 | Implement file validation (type, size) | Must | 2 |
| 4.3 | Add upload progress indicator | Should | 2 |
| 4.4 | Create Excel parsing service | Must | 8 |
| 4.5 | Implement data validation rules | Must | 5 |
| 4.6 | Add error reporting for failed uploads | Must | 3 |
| 4.7 | Create upload history page | Should | 3 |

### Epic 5: Data Processing & Automation (39 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 5.1 | Extract formulas from Excel | Must | 8 |
| 5.2 | Map Excel columns to database fields | Must | 5 |
| 5.3 | Implement formula-to-SQL conversion | Must | 8 |
| 5.4 | Create background job for processing | Must | 5 |
| 5.5 | Add data validation after processing | Must | 3 |
| 5.6 | Implement incremental updates | Should | 5 |
| 5.7 | Add data rollback capability | Should | 5 |

### Epic 6: Data Entry & Management (33 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 6.1 | Create data entry form | Must | 5 |
| 6.2 | Implement data grid view | Must | 8 |
| 6.3 | Add inline editing in grid | Should | 5 |
| 6.4 | Implement data filtering | Must | 3 |
| 6.5 | Add data sorting | Should | 2 |
| 6.6 | Create data validation rules | Must | 5 |
| 6.7 | Add data approval workflow | Should | 5 |

### Epic 7: Reporting & Dashboard (42 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 7.1 | Create dashboard overview page | Must | 8 |
| 7.2 | Implement report templates | Must | 8 |
| 7.3 | Add PDF export functionality | Must | 5 |
| 7.4 | Add Excel export functionality | Should | 3 |
| 7.5 | Create scheduled report generation | Could | 8 |
| 7.6 | Add report sharing via email | Could | 5 |
| 7.7 | Implement report customization | Should | 5 |

### Epic 8: System Settings & Configuration (22 pts)

| ID | Story | Priority | Points |
|----|-------|----------|--------|
| 8.1 | Create settings page | Must | 3 |
| 8.2 | Implement email settings | Should | 3 |
| 8.3 | Add system theme customization | Could | 5 |
| 8.4 | Create backup/restore functionality | Should | 8 |
| 8.5 | Add API key management | Could | 3 |

### Story Summary

| Epic | Name | Points |
|------|------|--------|
| 1 | Authentication & Authorization | 17 |
| 2 | User Management (Admin) | 21 |
| 3 | Organization & Data Structure | 23 |
| 4 | Excel File Upload | 26 |
| 5 | Data Processing & Automation | 39 |
| 6 | Data Entry & Management | 33 |
| 7 | Reporting & Dashboard | 42 |
| 8 | System Settings & Configuration | 22 |
| **Total** | | **223** |

---

## 6. Sprint Plan

### Sprint Breakdown

| Sprint | Dates | Focus | Points |
|--------|-------|-------|--------|
| Sprint 1 | March 8-9 | Foundation (Auth + Users) | 25 |
| Sprint 2 | March 10 | Data Structure | 23 |
| Sprint 3 | March 11 | Excel Upload | 26 |
| Sprint 4 | March 12 | Data Processing | 42 |
| Sprint 5 | March 13 | Reporting & Polish | 34 |

### Sprint 1: Foundation (March 8-9)

**Goal:** Set up project infrastructure and authentication

| ID | Story | Points |
|----|-------|--------|
| 1.1 | Setup Supabase project and configure auth | 3 |
| 1.2 | Create login page with email/password | 2 |
| 1.3 | Implement session management with cookies | 3 |
| 1.4 | Create user profile table and RLS policies | 5 |
| 1.5 | Implement role-based route protection | 3 |
| 1.6 | Create logout functionality | 1 |
| 2.1 | Create admin user management page | 5 |
| 2.2 | Implement user creation form | 3 |

**Deliverables:**
- Supabase project created
- Auth configured with email/password
- Login page working
- User roles implemented (Admin, Contributor, Viewer)
- Basic user management UI

### Sprint 2: Data Structure (March 10)

**Goal:** Set up organization and management themes

| ID | Story | Points |
|----|-------|--------|
| 2.3 | Implement user editing (role, details) | 3 |
| 2.4 | Implement user deletion | 2 |
| 3.1 | Create organization settings page | 5 |
| 3.2 | Implement management themes CRUD | 5 |
| 3.3 | Implement risk domains CRUD | 5 |
| 3.4 | Create drag-and-drop reordering | 3 |

**Deliverables:**
- Organization settings page
- Management themes CRUD
- Risk domains CRUD
- User management complete

### Sprint 3: Excel Upload (March 11)

**Goal:** Enable Excel file upload and processing

| ID | Story | Points |
|----|-------|--------|
| 4.1 | Create file upload component | 3 |
| 4.2 | Implement file validation (type, size) | 2 |
| 4.3 | Add upload progress indicator | 2 |
| 4.4 | Create Excel parsing service | 8 |
| 4.5 | Implement data validation rules | 5 |
| 4.6 | Add error reporting for failed uploads | 3 |
| 4.7 | Create upload history page | 3 |

**Deliverables:**
- File upload component
- Excel file parsing
- Data validation
- Upload history

### Sprint 4: Data Processing (March 12)

**Goal:** Automate data processing and formula replication

| ID | Story | Points |
|----|-------|--------|
| 5.1 | Extract formulas from Excel | 8 |
| 5.2 | Map Excel columns to database fields | 5 |
| 5.3 | Implement formula-to-SQL conversion | 8 |
| 5.4 | Create background job for processing | 5 |
| 5.5 | Add data validation after processing | 3 |
| 6.1 | Create data entry form | 5 |
| 6.2 | Implement data grid view | 8 |

**Deliverables:**
- Formula extraction from Excel
- SQL conversion
- Automated processing
- Data entry form
- Data grid view

### Sprint 5: Reporting & Polish (March 13)

**Goal:** Complete reporting and prepare for testing

| ID | Story | Points |
|----|-------|--------|
| 6.3 | Add inline editing in grid | 5 |
| 6.4 | Implement data filtering | 3 |
| 6.5 | Add data sorting | 2 |
| 7.1 | Create dashboard overview page | 8 |
| 7.2 | Implement report templates | 8 |
| 7.3 | Add PDF export functionality | 5 |
| 7.4 | Add Excel export functionality | 3 |

**Deliverables:**
- Dashboard overview
- Report templates
- PDF/Excel export
- Phase 1 testing ready

---

## Open Questions

1. **Excel Template**: Do we need to create a custom template for data entry, or will clients provide their own?
2. **Formula Complexity**: How complex are the Excel formulas that need to be replicated?
3. **Data Volume**: How many records per upload? What's the expected total data size?
4. **Report Frequency**: How often are reports generated - daily, weekly, monthly?
5. **Integration**: Does this need to integrate with any existing systems?

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| Client Rep | | | |

---

*Document generated: March 2026*
*BMAD Planning for MAST Phase 1*
