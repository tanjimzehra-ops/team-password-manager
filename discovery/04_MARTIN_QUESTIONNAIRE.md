# 04 — Martin Questionnaire: Information Required from Martin

> **Purpose**: Structured questions for Martin to answer before the MAST deep-dive session
> **Deadline**: At least 24 hours before the dedicated MAST deep-dive session
> **Format**: Martin should answer directly in this document or provide a separate written response

---

## Instructions for Martin

Please answer each question as specifically as possible. Where you can share files or screenshots, please note the file location or attach directly. If you don't know the answer, write "Unknown — need to check" so we can plan accordingly.

---

## A. Current System Workflow (8 Questions)

### A1. Complete Cycle Walkthrough
Walk through a complete MAST reporting cycle from start to finish. What triggers the cycle? What are the exact steps? Who does what?

**Answer**: _____________

### A2. Input Forms
How many individual input forms exist in the MAST ERIC system? List each form and which MAST staff member (or role) is responsible for filling it.

**Answer**: _____________

### A3. Variable File Structure
Describe the structure of the MAST variable file. What fields does it contain? What formulas are embedded? How does it connect to the data trees?

**Answer**: _____________

### A4. Data Tree Structure
Describe the MAST data tree hierarchy. How many levels? What are the main branches? How do data trees connect to input forms and reports?

**Answer**: _____________

### A5. Report Format
Share an actual MAST report (PDF or equivalent). If not available, describe the exact structure: how many pages, what sections, what visualisations?

**Answer**: _____________

### A6. Report Frequency
How often does MAST request reports? Monthly? Quarterly? Ad-hoc? Is there a fixed schedule?

**Answer**: _____________

### A7. Email Templates
When MAST emails CPF to request a report, what does that email typically say? Is there a standard format, or is it informal?

**Answer**: _____________

### A8. Data Validation
What validation do you perform before running a report? What checks do you run against the data trees? What errors do you look for?

**Answer**: _____________

---

## B. Users and Permissions (5 Questions)

### B1. Bill Batt's Role
What is Bill Batt's exact role at MAST? What does he do day-to-day? Why is he the proposed administrator?

**Answer**: _____________

### B2. Data Contributor Count
How many MAST staff currently contribute data to the ERIC system? List their names or roles if possible.

**Answer**: _____________

### B3. Board Member Count
How many board members or executives would need read-only access to reports? Who are they?

**Answer**: _____________

### B4. Current Access Control
How is access currently managed? Do all MAST staff use the same login, or do they have individual accounts? How do they access EricSFM.com?

**Answer**: _____________

### B5. Authorisation Meaning
When we say "Bill Batt authorises report generation" — what does that mean in practice? Does he review data before approving? Is it a formal sign-off or a simple trigger?

**Answer**: _____________

---

## C. Risk Register (4 Questions)

### C1. Risk Count
How many risks are currently in the MAST risk register? Can you list them (or their categories)?

**Answer**: _____________

### C2. Change Frequency
How often are risks added or removed? Is this a rare event or a regular process?

**Answer**: _____________

### C3. Approval Process
When a new risk is added, who decides? Is there a formal approval process?

**Answer**: _____________

### C4. Risk Fields
For each risk in the register, what fields/attributes are tracked? (e.g., description, likelihood, consequence, owner, status, mitigation actions)

**Answer**: _____________

---

## D. ERIC System Specifics (4 Questions)

### D1. Azure Database Separation
Is the MAST/ERIC Azure database the same database used by Jigsaw, or is it a completely separate database instance? This is critical for migration planning.

**Answer**: _____________

### D2. Documentation Sharing
You hold ERIC folders with source code, DataTrees, and user guide. Can you share these via the shared drive (once set up)? Please confirm what folders/files exist and their approximate total size.

**Answer**: _____________

### D3. Formulas and Calculations
Beyond the basic baseline=100 system, are there any custom formulas or calculations specific to MAST (not shared with other ERIC clients)?

**Answer**: _____________

### D4. Management Themes
What are the exact management themes used in the MAST reports? Are they the standard five (Clients, Service Delivery, Management & Governance, People & Culture, Risk), or are they customised for MAST's maritime context?

**Answer**: _____________

---

## E. Branding and Domain (3 Questions)

### E1. Style Guide
Does MAST have a brand style guide (colours, logo, fonts)? Can you obtain it from MAST or from existing MAST communications?

**Answer**: _____________

### E2. Domain Preference
What domain name should the MAST reporting portal use? Do you have a preference, or should we propose options?

**Answer**: _____________

### E3. Naming
Should the portal be called "MAST Risk Reporting", "MAST ERIC", or something else? Does MAST have a preference?

**Answer**: _____________

---

## Summary

| Category | Questions | Priority |
|----------|-----------|----------|
| A. Current System Workflow | 8 | Critical — blocks PRD |
| B. Users and Permissions | 5 | Critical — blocks permission design |
| C. Risk Register | 4 | High — defines data model |
| D. ERIC Specifics | 4 | High — blocks architecture decision |
| E. Branding and Domain | 3 | Medium — can be deferred slightly |
| **Total** | **24** | |

### Critical Path

Questions A1–A5, B1, B5, C1, and D1 are on the **critical path** — the PRD cannot be written without answers to these.

Questions E1–E3 can be answered later but should be resolved before frontend design begins.

---

## Martin's Workflow Email (3 March 2026)

Martin sent this via email today — his understanding of the current MAST workflow:

> 1. MAST identifies they want to update the report to the current period – in some cases wanting to modify a risk variable by adding or subtracting
> 2. CPF generates & saves new report template including as necessary the adjusted variable for the current period
> 3. This autogenerates forms for each MAST nominated manager to fill – these are autouploaded into ERIC report
> 4. MAST advises CPF when upload complete
> 5. CPF runs report
> 6. MAST staff and Board have read access to the report

### Key Insights from This Workflow

- **CPF is the bottleneck**: Steps 2 and 5 both require CPF action. Phase 1 goal = eliminate this dependency
- **"autogenerates forms"**: This implies a template-driven form generation system — needs investigation. What generates the forms? What format?
- **"autouploaded into ERIC report"**: There's an upload mechanism that feeds ERIC. This is the integration point to understand
- **Variable adjustment**: Users add/subtract from a risk variable — this is the core data input action
- **3 user types confirmed**: MAST (nominates managers), managers (fill forms), Staff+Board (read access)
- **Missing from workflow**: Who sets up the initial report template? Is it always CPF?

### Questions This Raises for the Deep Dive Session
1. What does "generate & save new report template" actually mean technically? (Excel macro? Separate tool?)
2. What format are the forms? (Email? Web form? Excel?)
3. Is the "autoupload" automated or does someone manually trigger it?
4. How long does the current end-to-end cycle take?
5. How many managers fill forms per cycle?
