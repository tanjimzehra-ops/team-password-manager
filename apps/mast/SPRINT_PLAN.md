# MAST Sprint Plan

> **Version:** 2.1 (Updated - Reporting Priority)
> **Date:** March 2026
> **Target:** Phase 1 Complete - March 13, 2026
> **Client:** Marine and Safety Tasmania (MAST)
> **Priority:** 🚀 Automation First - Clients self-generate reports

---

## Overview

| Item | Details |
|------|---------|
| **Project** | MAST (Management Assessment and Systems Tool) |
| **Goal** | Automate ERIC reporting - clients self-generate reports without emailing Martin |
| **Total Stories** | 45 |
| **Total Points** | 294 |
| **Sprints** | 6 |
| **Duration** | 6 weeks |

---

## Milestones

| Milestone | Date | Target | Status |
|-----------|------|--------|--------|
| **M1: REPORTING FIRST** | March 8 | Clients self-generate ERIC reports | - |
| M2: Project Setup | March 9 | Repo, Supabase, Auth | - |
| M3: Core Auth | March 10 | Login, Roles, User CRUD | - |
| M4: Data Structure | March 11 | Themes, Domains, Risk Model | - |
| M5: Excel Upload | March 12 | File upload, parsing | - |
| M6: Phase 1 Testing | March 13 | Phase 1 ready | - |

---

## Sprint Breakdown

### 🚀 Sprint 1: REPORTING AUTOMATION (March 8-9)

**Goal:** Clients can self-generate ERIC reports - NO EMAIL TO MARTIN!

**Key Quote from Meeting:**
> "The automation could happen if you just automate one part, cool. If you automate the entire process, even better... replicate what's on the Excel file into a database with the formulas and scripts... and then the database populates the report"

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 7.1 | Create dashboard overview page | 8 | - |
| 7.2 | Implement report templates (ERIC indices) | 8 | - |
| 7.3 | Add PDF export functionality | 5 | - |
| 7.4 | Add Excel export functionality | 3 | - |
| 7.5 | Create scheduled report generation | 8 | - |
| 5.1 | Extract formulas from Excel | 8 | - |
| 5.3 | Implement formula-to-SQL conversion | 8 | - |
| 1.7 | Implement password reset flow | 3 | - |
| 2.1 | Create admin user management page | 5 | - |
| 2.2 | Implement user creation form | 3 | - |

**Total Points:** 48

**Deliverables:**
- [ ] Dashboard with ERIC indices visualization
- [ ] Report templates (5 ERIC indices)
- [ ] PDF export
- [ ] Excel export
- [ ] Formula extraction from Excel
- [ ] Formula-to-SQL conversion
- [ ] Auto-populated reports from database
- [ ] Clients can self-generate reports (NO EMAIL TO MARTIN!)

---

### Sprint 2: Foundation (March 10)

**Goal:** Set up project infrastructure and authentication

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 1.1 | Setup Supabase project and configure auth | 3 | - |
| 1.2 | Create login page with email/password | 2 | - |
| 1.3 | Implement session management with cookies | 3 | - |
| 1.4 | Create user profile table and RLS policies | 5 | - |
| 1.5 | Implement role-based route protection | 3 | - |
| 1.6 | Create logout functionality | 1 | - |
| 1.7 | Implement password reset flow | 3 | - |

**Total Points:** 20

**Deliverables:**
- [ ] Supabase project created
- [ ] Auth configured with email/password
- [ ] Login page working
- [ ] User roles implemented (Admin, Manager, Contributor, Viewer)

---

### Sprint 3: Data Structure (March 11)

**Goal:** Set up organization, management themes, and risk domains

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 2.1 | Create admin user management page | 5 | - |
| 2.2 | Implement user creation form | 3 | - |
| 2.3 | Implement user editing (role, details) | 3 | - |
| 2.4 | Implement user deletion | 2 | - |
| 2.5 | Add domain assignment for managers | 3 | - |
| 3.1 | Create organization settings page | 5 | - |
| 3.2 | Implement management themes CRUD | 5 | - |
| 3.3 | Implement risk domains CRUD | 5 | - |
| 3.4 | Seed 6 management themes for MAST | 3 | - |
| 3.5 | Seed 19 risk domains for MAST | 5 | - |

**Total Points:** 31

**Deliverables:**
- [ ] Organization settings page
- [ ] Management themes CRUD
- [ ] 6 management themes seeded
- [ ] 19 risk domains seeded
- [ ] User management complete

---

### Sprint 3: Excel Upload (March 11)

**Goal:** Enable Excel file upload and processing

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 4.1 | Create file upload component | 3 | - |
| 4.2 | Implement file validation (type, size) | 2 | - |
| 4.3 | Add upload progress indicator | 2 | - |
| 4.4 | Create Excel parsing service | 8 | - |
| 4.5 | Implement data validation rules | 5 | - |
| 4.6 | Add error reporting for failed uploads | 3 | - |
| 4.7 | Create upload history page | 3 | - |
| 4.8 | Create Excel template download | 2 | - |

**Total Points:** 28

**Deliverables:**
- [ ] File upload component
- [ ] Excel file parsing
- [ ] Data validation
- [ ] Upload history
- [ ] Excel template

---

### Sprint 4: Risk Management (March 12 - Part 1)

**Goal:** Core risk management functionality for 200+ risks

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 5.1 | Create risk listing page | 5 | - |
| 5.2 | Create risk creation form | 5 | - |
| 5.3 | Implement risk editing | 3 | - |
| 5.4 | Add risk domain assignment | 3 | - |
| 5.5 | Implement risk dynamics tracking | 8 | - |
| 5.6 | Implement residual risk tracking | 5 | - |
| 5.7 | Add strategic/operational tagging | 3 | - |
| 5.8 | Create risk filtering and search | 5 | - |
| 5.9 | Implement risk period management | 5 | - |

**Total Points:** 42

**Deliverables:**
- [ ] Risk listing page with 200+ risks
- [ ] Risk creation/editing
- [ ] Risk dynamics tracking (escalation/de-escalation)
- [ ] Residual risk tracking
- [ ] Strategic/Operational tagging
- [ ] Period management

---

### Sprint 5: Data Processing & Reporting (March 12 - Part 2)

**Goal:** Automated data processing and dashboard reporting

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 6.1 | Extract formulas from Excel | 8 | - |
| 6.2 | Map Excel columns to database fields | 5 | - |
| 6.3 | Implement formula-to-SQL conversion | 8 | - |
| 6.4 | Create background job for processing | 5 | - |
| 6.5 | Add data validation after processing | 3 | - |
| 7.1 | Create data entry form | 5 | - |
| 7.2 | Implement data grid view | 8 | - |
| 7.3 | Add inline editing in grid | 5 | - |
| 7.4 | Implement data filtering | 3 | - |

**Total Points:** 50

**Deliverables:**
- [ ] Formula extraction from Excel
- [ ] SQL conversion
- [ ] Automated processing
- [ ] Data entry form
- [ ] Data grid view
- [ ] Inline editing

---

### Sprint 6: Final Reporting & Polish (March 13)

**Goal:** Complete reporting dashboard and prepare for testing

**Stories:**
| ID | Story | Points | Owner |
|----|-------|--------|-------|
| 8.1 | Create dashboard overview page | 8 | - |
| 8.2 | Implement board executive report | 8 | - |
| 8.3 | Implement manager domain report | 5 | - |
| 8.4 | Add PDF export functionality | 5 | - |
| 8.5 | Add Excel export functionality | 3 | - |
| 8.6 | Create risk visualization charts | 8 | - |
| 8.7 | Implement drill-down functionality | 5 | - |

**Total Points:** 42

**Deliverables:**
- [ ] Dashboard overview
- [ ] Board executive report
- [ ] Manager domain reports
- [ ] PDF/Excel export
- [ ] Risk visualization charts
- [ ] Drill-down functionality
- [ ] Phase 1 testing ready

---

## Timeline View

```
Week 1         Week 2         Week 3         Week 4         Week 5         Week 6
Mar 8-9        Mar 10         Mar 11         Mar 12         Mar 13         
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Sprint 1    │ Sprint 2    │ Sprint 3    │ Sprint 4    │ Sprint 5    │ Sprint 6
│             │             │             │             │             │
│ - Auth      │ - Org      │ - Upload    │ - Risks     │ - Process   │ - Reports
│ - Users     │ - Themes   │ - Parse     │ - Dynamics  │ - Data Grid │ - Dashboard
│ - Login     │ - Domains  │ - Validate  │ - Residual  │ - Formulas  │ - Export
│             │             │ - Template  │ - Period    │             │ - Polish
│ 28 pts      │ 31 pts     │ 28 pts      │ 42 pts      │ 50 pts      │ 42 pts
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
      ▲             ▲             ▲             ▲             ▲             ▲
      │             │             │             │             │             │
    M1            M2            M3            M4            M5            M6
  Setup          Auth         Upload        Risks        Process      Testing
```

---

## Resource Allocation

| Role | Responsibilities |
|------|------------------|
| Lead Developer | Architecture, Supabase, Auth |
| Frontend Dev | UI Components, Pages |
| QA | Testing, Bug Reports |

---

## Dependencies

1. **Supabase Account** - Need access to create project
2. **Excel Template** - BDO provided template for testing
3. **Client Data** - ERIC report structure from MAST
4. **Formula Documentation** - BDO Data and Formulas file

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase setup delays | High | Prepare in advance, use local dev |
| Complex formulas (BDO) | High | Prototype early, document edge cases |
| 200+ risk scalability | Medium | Design for performance from start |
| Timeline pressure | Medium | Prioritize MVP, defer non-essentials |
| Client availability | Medium | Async updates, clear documentation |

---

## Definition of Done

- [ ] Code complete and reviewed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Demo to stakeholder
- [ ] Feedback incorporated

---

## Phase 1 Success Criteria

1. ✅ Data contributors can upload Excel files
2. ✅ Excel formulas automated in database
3. ✅ Reports generate automatically
4. ✅ Role-based access working (Admin/Manager/Contributor/Viewer)
5. ✅ Dashboard with graphical outcomes for 200+ risks
6. ✅ Risk dynamics tracking implemented
7. ✅ Phase 1 testing completed by March 13

---

## Next Steps

1. Confirm Supabase access/credentials
2. Review Excel template (BDO provided)
3. Clarify ERIC report structure
4. Assign story ownership
5. Start Sprint 1

---

## Open Questions

1. Do we use existing Supabase or create new project?
2. What's the Excel template format?
3. Are there any specific formula requirements?
4. What's the preferred reporting frequency?
5. Who is the primary stakeholder for demos?

---

*Document Version: 2.0 - Refreshed with source document analysis*
*Last Updated: March 2026*
