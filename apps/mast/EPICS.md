# MAST Epics and User Stories

> **Version:** 2.0 (Refreshed)
> **Date:** March 2026
> **Client:** Marine and Safety Tasmania (MAST)
> **Total Stories:** 45
> **Total Points:** 256

---

## Epic 1: Authentication & Authorization

**Goal:** Implement secure authentication and role-based access control

**Description:** Set up Supabase authentication with four-tier roles (Admin, Manager, Contributor, Viewer) and route protection.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 1.1 | Setup Supabase project and configure auth | Must | 3 | - |
| 1.2 | Create login page with email/password | Must | 2 | 1.1 |
| 1.3 | Implement session management with cookies | Must | 3 | 1.2 |
| 1.4 | Create user profile table and RLS policies | Must | 5 | 1.1 |
| 1.5 | Implement role-based route protection | Must | 3 | 1.3, 1.4 |
| 1.6 | Create logout functionality | Must | 1 | 1.3 |
| 1.7 | Implement password reset flow | Should | 3 | 1.2 |

**Epic Points:** 20

---

## Epic 2: User Management (Admin)

**Goal:** Allow administrators to manage users and roles

**Description:** Admin functionality for user CRUD, role assignment, and domain allocation.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 2.1 | Create admin user management page | Must | 5 | 1.4 |
| 2.2 | Implement user creation form | Must | 3 | 2.1 |
| 2.3 | Implement user editing (role, details) | Must | 3 | 2.1 |
| 2.4 | Implement user deletion | Should | 2 | 2.1 |
| 2.5 | Add domain assignment for managers | Must | 3 | 2.3 |
| 2.6 | Add user invitation via email | Could | 5 | 2.2 |
| 2.7 | Create user activity audit log view | Should | 3 | 1.4 |

**Epic Points:** 24

---

## Epic 3: Organization & Data Structure

**Goal:** Set up organization, management themes, and risk domains

**Description:** Configure the 6 management themes and 19 risk domains for MAST.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 3.1 | Create organization settings page | Must | 5 | 1.4 |
| 3.2 | Implement management themes CRUD | Must | 5 | 3.1 |
| 3.3 | Implement risk domains CRUD | Must | 5 | 3.2 |
| 3.4 | Seed 6 management themes for MAST | Must | 3 | 3.2 |
| 3.5 | Seed 19 risk domains for MAST | Must | 5 | 3.3, 3.4 |
| 3.6 | Create drag-and-drop reordering | Should | 3 | 3.3 |
| 3.7 | Add theme/domain import from Excel | Could | 5 | 3.2, 3.3 |

**Epic Points:** 31

---

## Epic 4: Excel File Upload

**Goal:** Enable data contributors to upload Excel files

**Description:** File upload component with validation and Excel parsing.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 4.1 | Create file upload component | Must | 3 | 1.5 |
| 4.2 | Implement file validation (type, size) | Must | 2 | 4.1 |
| 4.3 | Add upload progress indicator | Should | 2 | 4.1 |
| 4.4 | Create Excel parsing service | Must | 8 | 1.1 |
| 4.5 | Implement data validation rules | Must | 5 | 4.4 |
| 4.6 | Add error reporting for failed uploads | Must | 3 | 4.5 |
| 4.7 | Create upload history page | Should | 3 | 4.1 |
| 4.8 | Create Excel template download | Must | 2 | 4.1 |

**Epic Points:** 28

---

## Epic 5: Risk Management

**Goal:** Core risk management functionality - tracking 200+ risks

**Description:** Create, edit, and track risks with dynamics and residual risk.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 5.1 | Create risk listing page | Must | 5 | 3.3 |
| 5.2 | Create risk creation form | Must | 5 | 5.1 |
| 5.3 | Implement risk editing | Must | 3 | 5.1 |
| 5.4 | Add risk domain assignment | Must | 3 | 5.2 |
| 5.5 | Implement risk dynamics tracking (escalation/de-escalation) | Must | 8 | 5.1 |
| 5.6 | Implement residual risk tracking | Must | 5 | 5.1 |
| 5.7 | Add strategic/operational tagging | Must | 3 | 5.2 |
| 5.8 | Create risk filtering and search | Must | 5 | 5.1 |
| 5.9 | Implement risk period management | Must | 5 | 5.1 |

**Epic Points:** 42

---

## Epic 6: Data Processing & Automation

**Goal:** Automate Excel formula replication and data processing

**Description:** Convert Excel formulas to database queries and process uploaded data.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 6.1 | Extract formulas from Excel | Must | 8 | 4.4 |
| 6.2 | Map Excel columns to database fields | Must | 5 | 6.1 |
| 6.3 | Implement formula-to-SQL conversion | Must | 8 | 6.1 |
| 6.4 | Create background job for processing | Must | 5 | 4.5 |
| 6.5 | Add data validation after processing | Must | 3 | 6.4 |
| 6.6 | Implement incremental updates | Should | 5 | 6.4 |
| 6.7 | Add data rollback capability | Should | 5 | 6.4 |

**Epic Points:** 39

---

## Epic 7: Data Entry & Management

**Goal:** Allow manual data entry and management

**Description:** Data grid view and manual entry forms for contributors.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 7.1 | Create data entry form | Must | 5 | 5.1 |
| 7.2 | Implement data grid view | Must | 8 | 3.3 |
| 7.3 | Add inline editing in grid | Should | 5 | 7.2 |
| 7.4 | Implement data filtering | Must | 3 | 7.2 |
| 7.5 | Add data sorting | Should | 2 | 7.2 |
| 7.6 | Create data validation rules | Must | 5 | 7.1 |
| 7.7 | Add data approval workflow | Should | 5 | 7.1 |

**Epic Points:** 33

---

## Epic 8: Reporting & Dashboard

**Goal:** Generate automated reports and dashboards

**Description:** Executive dashboard, board reports, and domain-specific reports.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 8.1 | Create dashboard overview page | Must | 8 | 5.1 |
| 8.2 | Implement board executive report | Must | 8 | 8.1 |
| 8.3 | Implement manager domain report | Must | 5 | 8.1, 3.3 |
| 8.4 | Add PDF export functionality | Must | 5 | 8.2 |
| 8.5 | Add Excel export functionality | Should | 3 | 8.2 |
| 8.6 | Create risk visualization charts | Must | 8 | 8.1 |
| 8.7 | Implement drill-down functionality | Must | 5 | 8.6 |
| 8.8 | Create scheduled report generation | Could | 8 | 8.2 |
| 8.9 | Add report sharing via email | Could | 5 | 8.2 |

**Epic Points:** 55

---

## Epic 9: System Settings & Configuration

**Goal:** Allow system-wide configuration

**Description:** Settings pages, theme customization, and backup functionality.

### Stories

| ID | Story | Priority | Points | Dependencies |
|----|-------|----------|--------|--------------|
| 9.1 | Create settings page | Must | 3 | 1.5 |
| 9.2 | Implement email settings | Should | 3 | 9.1 |
| 9.3 | Add system theme customization | Could | 5 | 9.1 |
| 9.4 | Create backup/restore functionality | Should | 8 | 9.1 |
| 9.5 | Add API key management | Could | 3 | 9.1 |

**Epic Points:** 22

---

## Story Summary

| Epic | Name | Points |
|------|------|--------|
| 1 | Authentication & Authorization | 20 |
| 2 | User Management (Admin) | 24 |
| 3 | Organization & Data Structure | 31 |
| 4 | Excel File Upload | 28 |
| 5 | Risk Management | 42 |
| 6 | Data Processing & Automation | 39 |
| 7 | Data Entry & Management | 33 |
| 8 | Reporting & Dashboard | 55 |
| 9 | System Settings & Configuration | 22 |
| **Total** | | **294** |

---

## Sprint Planning Recommendation

Based on the story points, here's a suggested sprint breakdown:

### Sprint 1 (Week 1): Foundation
- Epic 1: Authentication (20 pts)
- Epic 2: User Management (partial - 10 pts)

**Total:** ~30 points

### Sprint 2 (Week 2): Data Structure
- Epic 3: Organization Structure (31 pts)
- Epic 4: Excel Upload (partial - 15 pts)

**Total:** ~46 points

### Sprint 3 (Week 3): Risk Management
- Epic 4: Excel Upload (remaining - 13 pts)
- Epic 5: Risk Management (42 pts)

**Total:** ~55 points

### Sprint 4 (Week 4): Data Processing
- Epic 6: Data Processing (39 pts)
- Epic 7: Data Entry (partial - 15 pts)

**Total:** ~54 points

### Sprint 5 (Week 5): Reporting
- Epic 7: Data Entry (remaining - 18 pts)
- Epic 8: Reporting (55 pts)

**Total:** ~73 points

### Sprint 6 (Week 6): Polish
- Epic 9: Settings (22 pts)
- Bug fixes and testing

**Total:** ~30 points

---

## Dependencies

| Story | Depends On |
|-------|------------|
| 2.1 | 1.1, 1.2 |
| 2.2 | 1.4 |
| 3.1 | 1.1, 1.4 |
| 3.2 | 3.1 |
| 3.3 | 3.2 |
| 4.1 | 1.1, 1.2 |
| 4.4 | 4.1, 4.2 |
| 5.1 | 3.3 |
| 5.2 | 5.1 |
| 5.5 | 5.1 |
| 6.1 | 4.4 |
| 6.3 | 6.1 |
| 7.1 | 5.1 |
| 7.2 | 3.3 |
| 8.1 | 5.1 |
| 8.2 | 8.1 |
| 8.6 | 8.1 |

---

## Notes

- Priority ratings: Must, Should, Could, Won't (for now)
- Story points are estimates - adjust based on team velocity
- Some stories can be parallelized (check dependencies)
- Consider MVP: Focus on Epics 1-6 for Phase 1
- Phase 1 Target: March 13, 2026

---

*Document Version: 2.0 - Refreshed with source document analysis*
*Last Updated: March 2026*
