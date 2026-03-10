# MAST (Management Assessment and Systems Tool) - Product Requirements Document

> **Version:** 2.0 (Refreshed)
> **Date:** March 2026
> **Status:** Ready for Development
> **Client:** Marine and Safety Tasmania (MAST)

---

## 1. Introduction

### 1.1 Purpose

MAST (Management Assessment and Systems Tool) is a web-based platform designed to automate the ERIC (Evidence, Research, Innovation, Impact, Outcomes) reporting process for local government clients. This PRD outlines the requirements for Phase 1 implementation specifically for Marine and Safety Tasmania (MAST).

### 1.2 Scope

Phase 1 focuses on:
- Role-based access control (4-tier: Admin, Manager, Contributor, Viewer)
- Excel file upload and processing with formula automation
- Automated data handling for 200+ risks
- Risk dynamics tracking (escalation, de-escalation, new high risks)
- Report generation with graphical outcomes
- Dashboard with drill-down capabilities

### 1.3 Target Users

| Role | Description | Permissions |
|------|-------------|-------------|
| **Administrator** | Full system access, user management, data validation | All CRUD, user management, settings, audit logs |
| **Manager** | Domain-specific access | View/edit their domains, generate domain reports |
| **Data Contributor** | Upload Excel files, enter data, generate reports | Upload files, create/edit data, generate reports |
| **Viewer/Board** | Read-only access to reports and dashboards | View data and reports only |

---

## 2. Problem Statement (from Client Pain Points)

### 10 Pain Points to Address

| # | Pain Point | Solution Required |
|---|------------|------------------|
| 1 | Difficulty accessing risks | Simplified navigation and search |
| 2 | Complex data entry | Simplified table structure for data entry |
| 3 | Period management | Track current period and next period allocations |
| 4 | Access restrictions | Managers can access their domain with role-based access |
| 5 | Reporting gaps | Dedicated Board/exec report for critical risks |
| 6 | Domain reports | Dedicated managers domain report |
| 7 | Risk dynamics | Track escalation, de-escalation, new high risks |
| 8 | Residual risk | Track residual risk dynamics |
| 9 | Strategic/Operational | Key strategic and operational combinations |
| 10 | Graphical reports | Reports with charts for 200+ risks with different focus levels |

---

## 3. System Overview

### 3.1 Core Features

1. **Authentication & Authorization**
   - Session-based login with secure credentials
   - Four-tier role system (Admin, Manager, Contributor, Viewer)
   - Credential verification on each login
   - Role-based route protection

2. **Data Management**
   - Excel file upload (xlsx, xls, csv)
   - Data validation and processing
   - Formula automation in database
   - Manual data entry with simplified interface
   - Period management (current and next period)

3. **Risk Management**
   - Risk domain assignment
   - Risk dynamics tracking (escalation/de-escalation)
   - Residual risk tracking
   - Strategic/Operational combinations

4. **Reporting**
   - Automated report population from database
   - Export to PDF/Excel
   - Dashboard visualizations with drill-down
   - Board/executive reports
   - Manager domain reports

5. **Administration**
   - User management
   - Permission controls
   - Audit logging
   - Theme and domain configuration

---

## 4. User Stories

### 4.1 Authentication & Access

| ID | User Story | Priority | Points |
|----|------------|----------|--------|
| US-001 | As an Administrator, I want to log in with credentials so that I can access the system securely | Must Have | 2 |
| US-002 | As a Manager, I want to log in so that I can access my domain and generate reports | Must Have | 2 |
| US-003 | As a Data Contributor, I want to log in so that I can upload and manage data | Must Have | 2 |
| US-004 | As a Viewer/Board Member, I want to log in so that I can view executive reports and dashboards | Must Have | 2 |
| US-005 | As an Administrator, I want to manage user roles so that I can control access | Must Have | 3 |

### 4.2 Data Upload & Excel Processing

| ID | User Story | Priority | Points |
|----|------------|----------|--------|
| US-006 | As a Data Contributor, I want to upload Excel files so that I can input data | Must Have | 3 |
| US-007 | As a Data Contributor, I want to validate my data before submission so that errors are caught early | Should Have | 2 |
| US-008 | As a Data Contributor, I want to see upload progress so that I know the system is working | Could Have | 1 |
| US-009 | As a Data Contributor, I want to download an Excel template so that I know the correct format | Must Have | 2 |

### 4.3 Risk Management

| ID | User Story | Priority | Points |
|----|------------|----------|--------|
| US-010 | As a Manager, I want to view my assigned risk domains so that I can monitor my area | Must Have | 3 |
| US-011 | As a Data Contributor, I want to track risk escalation/de-escalation so that I can monitor risk dynamics | Must Have | 5 |
| US-012 | As a Data Contributor, I want to track residual risk so that I can assess risk treatment effectiveness | Must Have | 5 |
| US-013 | As a Data Contributor, I want to categorize risks by strategic/operational so that I can meet reporting requirements | Must Have | 3 |

### 4.4 Period Management

| ID | User Story | Priority | Points |
|----|------------|----------|--------|
| US-014 | As a Data Contributor, I want to manage period data so that I can track current and next period | Must Have | 3 |
| US-015 | As an Administrator, I want to configure reporting periods so that the system aligns with organizational cycles | Should Have | 2 |

### 4.5 Reporting & Dashboard

| ID | User Story | Priority | Points |
|----|------------|----------|--------|
| US-016 | As a Viewer/Board Member, I want to view the executive dashboard so that I can see critical risk overview | Must Have | 5 |
| US-017 | As a Manager, I want to view my domain report so that I can monitor my area's performance | Must Have | 5 |
| US-018 | As a Data Contributor, I want to export reports to PDF so that I can share them externally | Should Have | 3 |
| US-019 | As an Administrator, I want to customize report templates so that they meet client needs | Could Have | 5 |
| US-020 | As a Viewer, I want to drill down into charts so that I can see detailed data | Must Have | 3 |
| US-021 | As a Board Member, I want to see graphical outcomes for 200+ risks so that I can understand the full picture | Must Have | 5 |

### 4.6 Administration

| ID | User Story | Priority | Points |
|----|------------|----------|--------|
| US-022 | As an Administrator, I want to create new users so that team members can access the system | Must Have | 3 |
| US-023 | As an Administrator, I want to assign roles to users so that access is controlled | Must Have | 2 |
| US-024 | As an Administrator, I want to view audit logs so that I can track system activity | Should Have | 3 |
| US-025 | As an Administrator, I want to configure management themes so that they align with organizational structure | Must Have | 5 |
| US-026 | As an Administrator, I want to configure risk domains so that they align with organizational structure | Must Have | 5 |

---

## 5. Functional Requirements

### 5.1 Authentication

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | Login Page | User authentication with email/password |
| FR-002 | Session Management | Maintain session with secure cookies |
| FR-003 | Logout | Clear session on logout |
| FR-004 | Password Reset | Allow password reset flow |
| FR-005 | Role-Based Routes | Protect routes based on user role |

### 5.2 Role Management

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-006 | Role Assignment | Assign Admin/Manager/Contributor/Viewer roles |
| FR-007 | Role Permissions | Enforce permission based on role |
| FR-008 | User CRUD | Create, Read, Update, Delete users |
| FR-009 | Domain Assignment | Assign risk domains to managers |

### 5.3 Excel Upload

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-010 | File Upload | Accept .xlsx, .xls, .csv files |
| FR-011 | File Validation | Validate file format and structure |
| FR-012 | Data Parsing | Parse Excel data into database records |
| FR-013 | Template Download | Provide Excel template for data entry |
| FR-014 | Formula Extraction | Extract formulas from Excel files |
| FR-015 | Formula Replication | Convert Excel formulas to database queries |

### 5.4 Risk Management

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-016 | Risk Domain Assignment | Assign risks to domains |
| FR-017 | Risk Dynamics Tracking | Track escalation/de-escalation status |
| FR-018 | Residual Risk Tracking | Track residual risk values |
| FR-019 | Strategic/Operational Tags | Tag risks as strategic or operational |
| FR-020 | Period Data Management | Track current and next period data |

### 5.5 Reporting

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-021 | Report Generation | Generate reports from database |
| FR-022 | Dashboard | Visual overview of key metrics |
| FR-023 | Board Report | Executive summary of critical risks |
| FR-024 | Domain Report | Manager-specific domain reports |
| FR-025 | PDF Export | Export reports to PDF format |
| FR-026 | Excel Export | Export raw data to Excel |
| FR-027 | Drill-Down | Interactive chart drill-down |

---

## 6. Database Schema

### 6.1 Core Tables

```sql
-- Organizations (Multi-tenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Management Themes (6 themes for MAST)
CREATE TABLE management_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Domains (19 domains for MAST)
CREATE TABLE risk_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES management_themes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks (200+ risks for MAST)
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    risk_domain_id UUID REFERENCES risk_domains(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    inherent_risk INTEGER,  -- 1-5 scale
    current_risk INTEGER,   -- 1-5 scale
    residual_risk INTEGER,  -- 1-5 scale
    risk_type VARCHAR(50),  -- 'strategic' or 'operational'
    dynamics_status VARCHAR(50),  -- 'new', 'escalated', 'de-escalated', 'stable'
    period VARCHAR(50),
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Records
CREATE TABLE data_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risks(id) ON DELETE CASCADE,
    risk_domain_id UUID REFERENCES risk_domains(id) ON DELETE CASCADE,
    period VARCHAR(50) NOT NULL,
    value NUMERIC,
    notes TEXT,
    uploaded_by UUID REFERENCES profiles(id),
    validated_by UUID REFERENCES profiles(id),
    is_validated BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Excel Uploads
CREATE TABLE excel_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    record_count INTEGER DEFAULT 0,
    error_message TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,  -- 'board', 'domain', 'summary'
    config JSONB DEFAULT '{}',
    generated_by UUID REFERENCES profiles(id),
    file_path TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Non-Functional Requirements

### 7.1 Performance
- File upload: Support files up to 10MB
- Report generation: Complete within 30 seconds
- Page load: Under 3 seconds
- Support 200+ risks with different focus levels

### 7.2 Security
- Password hashing with bcrypt
- Session timeout: 30 minutes
- HTTPS only in production
- Row Level Security (RLS) for data isolation

### 7.3 Reliability
- Data validation before processing
- Error recovery for failed uploads
- Backup capability

---

## 8. Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Processing | xlsx (SheetJS) |
| PDF Generation | @react-pdf/renderer |
| Deployment | Vercel |

---

## 9. Timeline

| Milestone | Date | Deliverables |
|-----------|------|--------------|
| M1: Project Setup | March 8 | Repo, Supabase, Auth |
| M2: Core Auth | March 9 | Login, Roles, User CRUD |
| M3: Excel Upload | March 10 | File upload, parsing |
| M4: Data Processing | March 11 | Formula automation |
| M5: Reporting | March 12 | Dashboard, Reports |
| M6: Testing | March 13 | Phase 1 ready for testing |

---

## 10. Open Questions

1. **Excel Template**: Do we need to create a custom template for data entry, or will clients provide their own?
2. **Formula Complexity**: How complex are the Excel formulas that need to be replicated?
3. **Data Volume**: How many records per upload? What's the expected total data size?
4. **Report Frequency**: How often are reports generated - daily, weekly, monthly?
5. **Integration**: Does this need to integrate with any existing systems?
6. **Risk Scale**: Confirm 200+ risks with different focus levels requirement

---

## 11. Dependencies

- Supabase project setup
- Excel template (BDO provided)
- Client data structure documentation
- ERIC report template
- BDO Data and Formulas file

---

## 12. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex Excel formulas | High | Early prototype testing with BDO formulas |
| Data migration | Medium | Detailed mapping process |
| Client availability | Medium | Async communication channels |
| Timeline pressure | Medium | Prioritize Phase 1 scope |
| 200+ risk scalability | Medium | Design for performance from start |

---

*Document Version: 2.0 - Refreshed with source document analysis*
*Last Updated: March 2026*
