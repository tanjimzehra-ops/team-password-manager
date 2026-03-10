# MAST (Management Assessment and Systems Tool) - Brief

> **Project:** MAST Phase 1 Automation - ERIC Performance Framework
> **Client:** Marine and Safety Tasmania (MAST)
> **Date:** March 2026
> **Version:** 2.0 (Refreshed)
> **Source:** CPF Team PM Session Review + ERIC Documents + Client Feedback
> **Branch:** mast-development (local only)

---

## 1. Executive Summary

### Project Overview

MAST (Management Assessment and Systems Tool) is a web-based platform for **Marine and Safety Tasmania (MAST)** - a Tasmanian government agency responsible for marine safety, regulation, and services. The project aims to automate the ERIC (Evidence, Research, Innovation, Impact, Outcomes) reporting process for their performance framework.

### Key Objectives:
- Automate ERIC reporting workflow currently done manually in Excel
- Enable data entry by non-technical users through simplified interfaces
- Provide role-based access control (Admin, Manager, Contributor, Viewer/Board)
- Generate automated reports with charts, drill-downs, and visualizations
- Track risk dynamics (escalation, de-escalation, new high risks)
- Support 200+ risks with different focus levels

### Target Capabilities:
| Capability | Description |
|------------|-------------|
| **Risk Management** | Easy access to add, edit, amend risks |
| **Simplified Data Entry** | Simplified table structure for data entry |
| **Period Management** | Track current period and next period allocations |
| **Role-Based Access** | Managers can access their domain, Board/Exec views |
| **Board Reporting** | Report structure for Board/exec around critical risks |
| **Domain Reports** | Dedicated managers domain report |
| **Risk Dynamics** | Track escalation, de-escalation, new high risks |
| **Residual Risk** | Track residual risk dynamics |
| **Strategic/Operational** | Key strategic and operational combinations |
| **Graphical Reports** | Reports with charts and drill-down for 200+ risks |
| **Auto-Reporting** | Reports populate automatically from database |
| **Standalone Database** | Supabase database for MAST |

---

## 2. Current State (As-Is) - Pain Points

### Identified Issues (10 Pain Points from Client Feedback)

| # | Pain Point | Description | Impact |
|---|------------|-------------|--------|
| 1 | **Difficulty accessing** | Hard to access, add and/or amend the risks | Users spend excessive time navigating complex interface |
| 2 | **Complex data entry** | Need simplified table structure for data entry | Data entry errors and inefficiencies |
| 3 | **Period management** | New entry field for current period, risks need re-allocation to domains for next period | Manual reallocation errors |
| 4 | **Access restrictions** | Managers can't access or assess where they are in the system | Limited visibility and oversight |
| 5 | **Reporting gaps** | No Board/exec report for critical risks | Governance and compliance issues |
| 6 | **Domain reports** | Missing dedicated managers domain report | Lack of operational visibility |
| 7 | **Risk dynamics** | No tracking for escalation, de-escalation, new high risks | Inability to monitor risk movement |
| 8 | **Residual risk** | No tracking of residual risk dynamics | Incomplete risk assessment |
| 9 | **Strategic/Operational** | Need key strategic and operational combinations | Missing decision-support insights |
| 10 | **Graphical reports** | Need reports with graphical outcomes for 200+ risks with different focus levels | Board presentation limitations |

### Current Workflow (to be improved):
- Manual data entry in Excel spreadsheets
- No automated processing or calculations
- Limited access control and visibility
- Reports generated manually (time-consuming)
- No drill-down capabilities for 200+ risks
- No visualization of risk dynamics

---

## 3. Future State (To-Be)

### 6 Management Themes (from ERIC Report)

| # | Theme | Description | Risk Domains |
|---|-------|-------------|--------------|
| 1 | **Stakeholders** | Stakeholder numbers, engagement metrics | Various |
| 2 | **Service Delivery** | Service delivery metrics and KPIs | Various |
| 3 | **Management & Governance** | Governance KPIs and compliance | Various |
| 4 | **People & Culture** | Profile, utilisation, workforce metrics | Various |
| 5 | **Financial Management** | Solvency, frequency rates, budget tracking | Various |
| 6 | **Risk & Safety** | Marine safety, regulatory compliance | Various |

### 19 Risk Domains (identified from BDO Mast Custom Tree)

The 19 risk domains are organized under the 6 management themes and include:
- Strategic Risks
- Operational Risks
- Financial Risks
- Compliance Risks
- Stakeholder Risks
- Safety Risks
- (and more specific domain categories)

### Target User Roles

| Role | Description | Access Level |
|------|-------------|---------------|
| **Administrator** | Full system access | All CRUD, user management, settings |
| **Manager** | Domain-specific access | View/edit their domains, generate domain reports |
| **Data Contributor** | Upload and manage data | Upload files, create/edit data, generate reports |
| **Viewer/Board** | Read-only executive access | View dashboards and Board reports only |

---

## 4. Phase 1 Deliverables

### Database & Schema:
- [x] Database schema mapped with entities
- [x] Six custom management themes
- [x] 19 risk domains identified
- [x] Report structure finalized

### Core Features:
- [ ] Three-tier permission system (Admin, Manager, Contributor, Viewer)
- [ ] Excel file upload capability
- [ ] Automation scripts for data processing
- [ ] Automated report generation
- [ ] Dashboard with graphical outcomes
- [ ] Risk dynamics tracking

### Timeline:
- **March 13**: MAST Phase 1 ready for testing

---

## 5. Technical Considerations

### Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Processing | xlsx (SheetJS) |
| PDF Generation | @react-pdf/renderer |
| Deployment | Vercel |

### Authentication:
- Session management with proper credentials
- Security: Ask for credentials on each login
- Role-based route protection

### Database:
- Standalone Supabase database for MAST
- Migration path from existing systems
- Row Level Security (RLS) policies

### Development Workflow:
- Process: Brief → PRD → Architecture → Sprints → Stories
- Branch: mast-development (local only)

---

## 6. Meeting Notes (From March PM Session)

### Key Discussion Points:
1. **MAST looking good** - Nicolas reviewed and understood the system
2. **Need assure environment** - Required for MAST testing
3. **Daily time tracking** - Important for contracts
4. **Pradeep to conduct MAST live session**
5. **Data model mapped** - Entities and ERIC system mapped
6. **Six custom management themes** - Confirmed
7. **19 risk domains** - Identified
8. **Formulas available** - BDO provided Excel formulas for automation

### Next Steps:
- Set up assure environment for MAST
- Pradeep to schedule MAST live session
- Implement daily time tracking format
- Determine tracking system for mapping hours (contract requirement)
- Get access to MAST database (preferred) or work with documents

---

## 7. Dependencies & Risks

### Dependencies:
- Supabase database setup
- Excel processing library (xlsx/SheetJS)
- Report generation engine
- Client-provided Excel templates and formulas

### Risks:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex Excel formulas | High | Early prototype testing with BDO formulas |
| Data migration | Medium | Detailed mapping process from existing Excel |
| Client availability | Medium | Async communication channels |
| Timeline pressure | Medium | Prioritize Phase 1 scope |
| 200+ risk scalability | Medium | Design for performance from start |

---

## 8. Success Criteria

1. ✅ Data contributors can upload Excel files
2. ✅ Excel formulas automated in database
3. ✅ Reports generate automatically
4. ✅ Role-based access working (Admin/Manager/Contributor/Viewer)
5. ✅ Phase 1 testing completed by March 13
6. ✅ Dashboard with graphical outcomes for 200+ risks
7. ✅ Risk dynamics tracking implemented

---

## 9. Source Documents Reference

| Document | Location | Purpose |
|----------|----------|---------|
| Meeting Transcript | `CPF Team pm session review - March.txt` | Requirements, pain points |
| ERIC Report | `apps/mast/ERIC Docs/ERIC/Report - ERIC.pdf` | Report structure, themes |
| Client Pain Points | `apps/mast/ERIC Docs/ERIC/MAST Dynamic Risk Management Improvement.docx` | 10 pain points |
| Excel Formulas | `apps/mast/ERIC Docs/ERIC/BDO Data and Formulas (2).xlsx` | Formula automation |
| Risk Domains | `apps/mast/ERIC Docs/ERIC/BDO Mast Custom Tree (1).xlsx` | 19 risk domains |
| Risk Domains Backup | `apps/mast/ERIC Docs/ERIC/Copy of MAST Risk Domains.xlsx` | Alternative reference |

---

*Document Version: 2.0 - Refreshed with source document analysis*
*Last Updated: March 2026*
