# MAST Data Model Analysis

> **Deliverable**: Complete data model analysis from Martin's Excel files  
> **Date**: 4 March 2026  
> **Source Files**:
> - `BDO Mast Custom Tree (1).xlsx` — Data tree structure and report hierarchy
> - `BDO Data and Formulas (2).xlsx` — Entry types, formulas, data fields
> - `Copy of MAST Risk Domains.xlsx` — Risk domains and responsible managers

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Custom Tree Rows** | 92 |
| **Unique Entry IDs** | 287 |
| **Entry ID Range** | 491 - 3499 |
| **Total Formulas** | 2415 |
| **Data Entry Fields** | 7458 |
| **Risk Domains** | 19 |
| **Named Managers** | 5 (Bill Batt, Lia Morris, Justin Foster, Peter Hopkins, Toby Greenlees) |
| **Report Themes** | 6 (custom for MAST) |

---

## 1. Data Tree Hierarchy

### 1.1 Categories (Top Level)

The MAST data tree is organised into **6** main categories:

1. **Financial Performance**
2. **Human Resources**
3. **Stakeholders**
4. **Survey Results - Staff**
5. **Survey Results – Stakeholders**
6. **Targets**

### 1.2 Groups (Second Level)

The tree contains **18** groups across all categories:

1. Capacity of staff
2. Cost of staff
3. Financial
4. Fiscal management
5. Grants
6. License Partner Compliance
7. MAST Infrastructure
8. Navigation aids
9. Number of staff
10. Opportunity & Risk
11. People & Culture
12. Port Operations & Compliance
13. Recreational Boating
14. Revenue
15. Safety & Compliance
16. Solvency
17. Stakeholder engagement
18. Stakeholders

### 1.3 Complete Category → Group → Label Hierarchy


#### Financial Performance

**Fiscal management**

- Income variance analysis (% var. budget) *(Entry IDs: 549-556)*
- Expenditure variance analysis (% var. budget) *(Entry IDs: 557-563)*
- Creditor Turnover - days *(Entry IDs: 565)*

**Grants**

- Composition of grant revenue *(Entry IDs: 742-743)*

**Opportunity & Risk**

- Number of boat registrations *(Entry IDs: 566-569)*
- Boat registration retention rate *(Entry IDs: 570)*
- Number of license holders *(Entry IDs: 571-574)*
- License holder retention rate *(Entry IDs: 575-577)*
- Number of moorings *(Entry IDs: 578-746)*
- Mooring renewal retention rate *(Entry IDs: 579)*
- Number of Commercial Vessels *(Entry IDs: 580)*
- Commercial Vessel retention rate *(Entry IDs: 581)*
- Admin/Overhead spend *(Entry IDs: 582-586)*
- Funds composition *(Entry IDs: 587-589)*
- Recreational Boating Fund *(Entry IDs: 590-593)*
- Staff training expense (all CPD, formal training etc.) *(Entry IDs: 1070)*
- Total R&M, Replacements, Renewals in period *(Entry IDs: 740-741)*

**Revenue**

- Revenue breakup *(Entry IDs: 541-548)*

**Solvency**

- Total current assets *(Entry IDs: 1071)*
- Total non-current assets *(Entry IDs: 1072)*
- Total current liabilities *(Entry IDs: 1073)*
- Total non-current liabilities *(Entry IDs: 1074)*


#### Human Resources

**Capacity of staff**

- MAST workforce capacity and utilisation *(Entry IDs: 505-508)*
- Capacity by department  *(Entry IDs: 509-516)*

**Cost of staff**

- Payroll cost *(Entry IDs: 529-532)*
- Payroll cost by department *(Entry IDs: 533-537)*
- Leave Liability (measure against benchmarks) *(Entry IDs: 538-540)*

**Number of staff**

- Number of staff by FTE (all of MAST) *(Entry IDs: 491-496)*
- Number of staff by department *(Entry IDs: 497-504)*

**People & Culture**

- People & Culture Metrics/Drivers *(Entry IDs: 517-520)*
- Annual Performance Reviews *(Entry IDs: 521-522)*


#### Stakeholders

**License Partner Compliance**

- License Partners *(Entry IDs: 676-680)*
- License partner compliance *(Entry IDs: 753-754)*
- License course participants *(Entry IDs: 3363-3364)*

**MAST Infrastructure**

- Infrastructure assets *(Entry IDs: 643-646)*
- Infrastructure assets type *(Entry IDs: 647-651)*
- Infrastructure maintenance & safety *(Entry IDs: 652-3368)*

**Navigation aids**

- Navigation aid reliability *(Entry IDs: 661-664)*

**Port Operations & Compliance**

- Delegated Functions (based on most recent 12 month audit period completed) *(Entry IDs: 691-694)*
- Pilotage Incidents *(Entry IDs: 695-2296)*
- Pilots *(Entry IDs: 697-2285)*
- Pilots *(Entry IDs: 2286-2293)*
- Pilots *(Entry IDs: 2294-3367)*
- Pilotage exemption certificates *(Entry IDs: 702-2297)*
- Pilotage exemption certificates *(Entry IDs: 2298-2305)*
- Pilotage exemption certificates *(Entry IDs: 2306-3366)*
- No. pilotage movements *(Entry IDs: 739)*

**Recreational Boating**

- Boating fleet age by hull type *(Entry IDs: 594-597)*
- Boating fleet age by length *(Entry IDs: 598-756)*
- Boat geographic dispersion *(Entry IDs: 602-605)*
- License holder demographic *(Entry IDs: 606-610)*
- Moorings *(Entry IDs: 611-618)*
- Derelict vessels *(Entry IDs: 619-621)*

**Safety & Compliance**

- Compliance activity *(Entry IDs: 623-626)*
- Compliance outcomes *(Entry IDs: 627-630)*
- Boating incidents *(Entry IDs: 635-642)*
- Marine debris *(Entry IDs: 747-752)*
- Public awareness and education *(Entry IDs: 655-660)*

**Stakeholder engagement**

- Engagement *(Entry IDs: 665-672)*
- Right to information & Complaints *(Entry IDs: 673-738)*
- Schools Education Program *(Entry IDs: 683-3365)*


#### Survey Results - Staff

**People & Culture**

- I am treated with dignity & respect *(Entry IDs: 709)*
- I feel welcome *(Entry IDs: 710)*
- My wellbeing is considered important *(Entry IDs: 711)*
- I get support that enhances my performance *(Entry IDs: 712)*
- I have access to the resources and tools necessary to do my job well *(Entry IDs: 713)*
- I am actively involved in service improvement *(Entry IDs: 714)*
- Workforce training and development is of high quality *(Entry IDs: 715)*
- I am able to safely make suggestions and complaint to improve business performance *(Entry IDs: 716)*
- There is a focus on knowledge & capability development *(Entry IDs: 717)*
- I feel safe in the work environment *(Entry IDs: 718)*
- I feel that I am recognised and valued *(Entry IDs: 719)*
- I feel like my capabilities are recognised and utilised *(Entry IDs: 720)*
- I feel that there is a career pathway for me *(Entry IDs: 721)*
- I feel that I belong in the organisation *(Entry IDs: 722)*
- I am motivated to be actively involved *(Entry IDs: 723)*
- Organisational support enables me to be effective *(Entry IDs: 724)*
- I have confidence in the staff supports system *(Entry IDs: 725)*
- My quality of work-life is good *(Entry IDs: 726)*
- I often consider alternate employment *(Entry IDs: 727)*


#### Survey Results – Stakeholders

**Stakeholders**

- I am satisfied my primary boat ramp *(Entry IDs: 728)*
- MAST provides excellent value for money  from registration fees and license fees with improved facilities and education *(Entry IDs: 729)*
- I regularly service and inspect your life jacket *(Entry IDs: 730)*
- The information provided by MAST in recent times regarding safety is excellent *(Entry IDs: 731)*
- The boat wise newsletter provides useful information which I always read *(Entry IDs: 732)*
- Over the last 5 years the quality of recreational boating facilities has improved *(Entry IDs: 733)*
- I often engage with MAST on web, social media or in person *(Entry IDs: 734)*
- I find the MAST resources valuable *(Entry IDs: 735)*
- I find MAST staff approachable and informative *(Entry IDs: 736)*
- I am satisfied with the way MAST handles my queries *(Entry IDs: 737)*


#### Targets

**Financial**

- Solvency *(Entry IDs: 3497)*

**Stakeholders**

- Schools Education Program *(Entry IDs: 3498-3499)*

---

## 2. Entry ID to Data Type Mapping

### 2.1 Entry Types (Data Type Definitions)

| ID | Type Name |
|----|-----------|
| Id | Type |
| 0 | One to Ten |
| 1 | Percent |
| 2 | Currency |
| 3 | Decimal Number |
| 4 | Integer Number |
| 5 | Decimal Zero To Ten |
| 6 | Zero To Ten |
| 7 | Yes/NotYet/NM/NR  9/5/2/1 |
| 8 | Yes/No/Not Yet Answered  9/1/5 |
| 9 | Proceed |
| 10 | Agree/Disagree/Not Yet Assessed   9/1/5 |

### 2.2 Data Type Distribution (Entry Fields)

| Data Type | Type Name | Count | % of Total |
|-----------|-----------|-------|------------|
| 6 | Zero To Ten | 1826 | 24.5% |
| 5 | Decimal Zero To Ten | 1504 | 20.2% |
| 3 | Decimal Number | 1080 | 14.5% |
| 2 | Currency | 736 | 9.9% |
| 7 | Yes/NotYet/NM/NR  9/5/2/1 | 655 | 8.8% |
| 10 | Agree/Disagree/Not Yet Assessed   9/1/5 | 631 | 8.5% |
| 1 | Percent | 582 | 7.8% |
| 4 | Integer Number | 377 | 5.1% |
| 8 | Yes/No/Not Yet Answered  9/1/5 | 62 | 0.8% |
| 9 | Proceed | 5 | 0.1% |

**Total Entry Fields**: 7458

### 2.3 Entry ID Range Analysis

- **Minimum Entry ID**: 491
- **Maximum Entry ID**: 3499
- **Total Unique IDs in Tree**: 287
- **Total Registered Entry Fields**: 7458

---

## 3. Report Themes

MAST uses **6 custom report themes** (NOT the standard 5):

1. **Stakeholders** — Stakeholder satisfaction, engagement metrics
2. **Service Delivery** — Service performance, incident metrics
3. **Management & Governance** — Governance, compliance, risk management
4. **People & Culture** — HR metrics, staff demographics, culture surveys
5. **Financial Management** — Revenue, expenditure, variance analysis
6. **MAST Performance Framework Report** — Overall composite indices

> **Important**: These are MAST-specific custom themes, not the standard ERIC 5-theme structure.

---

## 4. Drill-Down Report Structure (NODE Hierarchy)

The tree defines drill-down navigation using NODE columns that create hierarchical report structures:

### Example NODE Structure (from Capacity of Staff row)


### NODE Hierarchy Pattern

The drill-down structure follows a tree pattern:
- NODE1 → Root level drill-down entry
- NODE2 → Child of NODE1
- NODE3 → Child of NODE2
- etc.

Each NODE can reference:
- **Entry IDs**: Raw data input fields (e.g., `{505}`)
- **Formula IDs**: Calculated values (e.g., `{F590}`)
- **Previous Period Values**: Time-series references (e.g., `P(6,596)`)

---

## 5. Formulas and Calculation Chains

### 5.1 Formula Statistics

| Metric | Value |
|--------|-------|
| **Total Formulas** | 2415 |
| **Formula ID Range** | 1 - 2442 |

### 5.2 Formula Examples

| Formula ID | Name | Formula | Entry Refs |
|------------|------|---------|------------|
| F1 | Complaint Frequency Rate  | `(({307}*4)/{286})` | 307, 286 |
| F2 | % of complaints resolved | `({293}/{307})` | 293, 307 |
| F3 | Incident frequency rate | `(({456}*4)/{286})` | 456, 286 |
| F4 | Incident Frequency rate - Cat  | `(({457}*4)/{286})` | 457, 286 |
| F5 | Incident frequency rate - Cat  | `(({458}*4)/{286})` | 458, 286 |
| F6 | Client Satisfaction Level | `AVGZERO({F7},{F8},{F9},{F10},{F11},{F12}` | - |
| F7 | I am treated with dignity & re | `AVGZERO({433},{434},{435},{436})` | 433, 434, 435, 436 |
| F8 | I feel welcome | `AVGZERO({430},{437},{431},{432})` | 430, 437, 431, 432 |
| F9 | My wellbeing is at the centre  | `AVGZERO({425},{426},{427},{428})` | 425, 426, 427, 428 |
| F10 | I am actively involved in maki | `AVGZERO({438},{439},{423},{424})` | 438, 439, 423, 424 |
| F11 | I get care and support that is | `AVGZERO({453},{454},{440},{446})` | 453, 454, 440, 446 |
| F12 | Care and support is of high qu | `AVGZERO({449},{450},{451},{452})` | 449, 450, 451, 452 |
| F13 | I am able to safely make sugge | `AVGZERO({445},{448},{447},{455})` | 445, 448, 447, 455 |
| F14 | I am confident that support st | `AVGZERO({441},{442},{443},{444})` | 441, 442, 443, 444 |
| F15 | I feel safe and comfortable in | `AVGZERO({401},{429},{422},{384})` | 401, 429, 422, 384 |
| F16 | I feel that I am recognised an | `AVGZERO({396},{397},{398},{399})` | 396, 397, 398, 399 |
| F17 | I feel like my capabilities ar | `AVGZERO({392},{393},{394},{395})` | 392, 393, 394, 395 |
| F18 | I feel that I belong in the se | `AVGZERO({391},{390},{389},{388})` | 391, 390, 389, 388 |
| F19 | I am motivated to actively inv | `AVGZERO({387},{400},{385},{386})` | 387, 400, 385, 386 |
| F20 | Service and supports enable me | `AVGZERO({418},{403},{419},{402})` | 418, 403, 419, 402 |

### 5.3 Calculation Order

Formulas are executed in calculation order to handle dependencies:

| Calculation Order | Formula Count |
|-------------------|---------------|
| 1 | 1929 |
| 2 | 207 |
| 3 | 135 |
| 4 | 43 |
| 5 | 37 |
| 6 | 9 |
| 7 | 4 |
| 8 | 1 |
| 9 | 1 |
| 10 | 1 |
| 11 | 1 |
| 14 | 14 |
| 15 | 21 |
| 16 | 1 |
| 17 | 1 |

### 5.4 Entry ID → Formula Cross-Reference

The following Entry IDs are referenced by formulas (sample):

| Entry ID | Referenced By Formulas |
|----------|------------------------|
| 198 | 74 |
| 946 | 45 |
| 103 | 28 |
| 119 | 28 |
| 102 | 28 |
| 152 | 28 |
| 286 | 27 |
| 1010 | 17 |
| 1044 | 17 |
| 1049 | 17 |
| 1054 | 17 |
| 1059 | 17 |
| 1064 | 17 |
| 541 | 16 |
| 196 | 15 |
| 1008 | 15 |
| 1043 | 15 |
| 1048 | 15 |
| 1053 | 15 |
| 1058 | 15 |

---

## 6. Risk Domains and Responsible Managers

### 6.1 Risk Domain List (19 Domains)

| # | Risk Domain | Responsible Manager |
|---|-------------|---------------------|
| 1 | Asset Management | Justin Foster |
| 2 | Autonomous technology & AI | Toby Greenlees |
| 3 | Boating fleet | Peter Hopkins/Toby Greenlees |
| 4 | Business continuity/Disaster recovery | Bill Batt |
| 5 | Business Systems | Bill Batt |
| 6 | Compliance monitoring | All Managers |
| 7 | Contract Management | All Managers |
| 8 | Corporate Governance | Lia Morris |
| 9 | Environment | All Managers |
| 10 | Experimential and novelty craft/vessels | Peter Hopkins/Toby Greenelees |
| 11 | Finance | Bill Batt |
| 12 | Human Resources | Lia Morris/Bill Batt |
| 13 | Information Management | Bill Batt |
| 14 | Legislative/Regulatory compliance | Lia Morris |
| 15 | Professional conduct | Lia Morris |
| 16 | Public Safety | Justin Foster/Lia Morris |
| 17 | Service delivery | Lia Morris |
| 18 | Stakeholder Engagement | Peter Hopkins/Toby Greenlees |
| 19 | WHS | Lia Morris |

### 6.2 Managers and Their Domains

| Manager | Domain Count | Domains |
|---------|--------------|---------|
| Lia Morris | 5 | Corporate Governance; Legislative/Regulatory compliance; Professional conduct (+2 more) |
| Bill Batt | 4 | Business continuity/Disaster recovery; Business Systems; Finance (+1 more) |
| All Managers | 3 | Compliance monitoring; Contract Management; Environment |
| Peter Hopkins/Toby Greenlees | 2 | Boating fleet; Stakeholder Engagement |
| Justin Foster | 1 | Asset Management |
| Toby Greenlees | 1 | Autonomous technology & AI |
| Peter Hopkins/Toby Greenelees | 1 | Experimential and novelty craft/vessels |
| Lia Morris/Bill Batt | 1 | Human Resources |
| Justin Foster/Lia Morris | 1 | Public Safety |

### 6.3 Named Managers Identified

The following **5 named individuals** are responsible for risk domains:

1. **Bill Batt** — Business continuity, Business Systems, Finance, Information Management
2. **Lia Morris** — Corporate Governance, HR (shared), Legislative compliance, Professional conduct, Public Safety (shared), Service delivery, WHS
3. **Justin Foster** — Asset Management, Public Safety (shared)
4. **Peter Hopkins** — Boating fleet (shared), Stakeholder Engagement (shared)
5. **Toby Greenlees** — Autonomous technology & AI, Boating fleet (shared), Experimential craft (shared), Stakeholder Engagement (shared)

Additionally, **"All Managers"** is assigned to:
- Compliance monitoring
- Contract Management
- Environment

### 6.4 Departments Referenced in Data Tree

Based on Entry ID labels in the Custom Tree, the following departments are tracked:

- Board
- Senior Mngt/Executive
- Administrative
- Recreational Boating
- Commercial Boating
- Infrastructure
- Education
- Other
- Corporate/Admin
- Facilities
- Moorings
- Ports & Pilotage

---

## 7. Report Frequency

**Confirmed**: Reports are generated **every 6 months** (bi-annually).

This was confirmed verbally by Martin during the week of 2 March 2026.

---

## 8. Key Data Model Constraints

### Phase 1 (Replication with Self-Service)

| Constraint | Decision |
|------------|----------|
| **Cell References** | Kept as-is (deferred to Phase 2) |
| **Report Themes** | Keep 6 custom MAST themes |
| **Entry ID Range** | Preserve 491–3499 range |
| **Formula Structure** | Maintain exact calculation chains |
| **Data Types** | Support all 11 entry types (IDs 0–10) |

### Phase 2 (Future Enhancement)

- Replace cell references with semantic labels
- Enable AI integration
- Consider report theme consolidation

---

## 9. Data Statistics Summary

| Category | Count |
|----------|-------|
| Custom Tree Rows | 92 |
| Unique Categories | 6 |
| Unique Groups | 18 |
| Unique Labels | 87 |
| Total Entry IDs | 287 |
| Entry Fields Registered | 7458 |
| Total Formulas | 2415 |
| Entry Types | 11 (IDs 0–10) |
| Risk Domains | 19 |
| Named Managers | 5 (Bill Batt, Lia Morris, Justin Foster, Peter Hopkins, Toby Greenlees) |
| Report Themes | 6 (custom) |
| Report Frequency | Every 6 months |

---

## 10. Files Analyzed

1. **`BDO Mast Custom Tree (1).xlsx`** — 188 rows, 60 columns
   - Sheet: `TREE MAST Custom`
   - Contains: Full data tree hierarchy with drill-down structures

2. **`BDO Data and Formulas (2).xlsx`** — 6 sheets
   - `Entry Types`: 12 data type definitions
   - `Data Formulas`: 2,415 formulas with calculation order
   - `Data Entry Fields`: 7,458 entry field definitions
   - `Label Categories`: 4 category types
   - `Formula Display Type`: 4 display types
   - `Entry Requirements`: 5 requirement types

3. **`Copy of MAST Risk Domains.xlsx`** — 19 risk domains
   - Sheet: `Sheet1`
   - Contains: Risk domain names and responsible managers

---

*Document generated: 4 March 2026*
*Analysis tool: Python 3 + openpyxl*
