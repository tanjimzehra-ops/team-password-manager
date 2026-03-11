# 05 — Pradeep Technical Investigation Checklist

> **Purpose**: Technical investigation tasks for Pradeep before the MAST deep-dive session
> **Deadline**: Before the dedicated MAST deep-dive session (~7 March 2026)
> **Report to**: Nicolas

---

## Investigation Items

### T1. Access and Validate MAST/ERIC Azure Database

**Objective**: Confirm whether the MAST/ERIC Azure database is separate from the Jigsaw Azure database.

**Steps**:
1. Access the Azure portal with current CPF credentials
2. List all database instances/resources under the CPF Azure subscription
3. Identify which database(s) serve ERIC and which serve Jigsaw
4. Document the database names, regions, and configurations
5. Check if the existing `azure_to_supabase.py` migration tool (in `backend/`) was used for ERIC data or only Jigsaw data

**Deliverable**: Written confirmation with database inventory — "ERIC uses [database X], Jigsaw uses [database Y], they are [same/separate]"

**Urgency**: Critical — this gates the entire migration strategy.

---

### T2. Export Azure Formulas — Assess Data Integrity

**Objective**: Determine whether all ERIC formulas and calculations can be exported from Azure without data loss.

**Steps**:
1. Identify all stored procedures, views, computed columns, or formula-equivalent logic in the Azure database
2. Attempt an export of the formula/calculation layer
3. Compare exported formulas against the original to verify integrity
4. Document any formulas that cannot be cleanly exported
5. Assess whether Excel-based data tree formulas are stored in the database or only in local Excel files

**Deliverable**: Integrity assessment document — "X of Y formulas export cleanly; these N formulas have issues: [list]"

**Urgency**: Critical — if formulas cannot be exported, the entire migration approach must be reconsidered.

---

### T3. Map Variable File Structure

**Objective**: Understand the complete structure of the MAST variable file.

**Steps**:
1. Obtain the MAST variable file from Martin (or from ERIC documentation once shared)
2. Map every field: name, data type, formula (if any), connection to data tree
3. Identify which fields are input (user-entered) vs calculated (derived)
4. Document the relationships between variable file fields and data tree nodes
5. Create a schema diagram showing the variable file structure

**Deliverable**: Schema diagram (can be text-based/ASCII) showing all fields, their types, formulas, and connections to data trees.

**Dependency**: Martin must share ERIC documentation (variable file template or example).

---

### T4. Map Data Tree Structure

**Objective**: Understand the complete hierarchy of MAST data trees.

**Steps**:
1. Obtain the MAST data tree files from Martin (or from ERIC documentation once shared)
2. Map the full hierarchy: levels, branches, connections
3. Identify how data trees connect to: (a) variable files, (b) input forms, (c) report output
4. Document the flow from raw input to report generation
5. Create a data flow diagram

**Deliverable**: Data flow diagram showing the complete path from data input to report output, including all data tree nodes and their relationships.

**Dependency**: Martin must share ERIC documentation (DataTrees folders).

---

### T5. Assess Supabase AU Region — Pricing and Compliance

**Objective**: Evaluate Supabase with Australian hosting for MAST's government data requirements.

**Steps**:
1. Check Supabase pricing for Australian region (Sydney)
2. Review Supabase compliance documentation for Australian government data
3. Compare costs: current Azure vs Supabase AU for equivalent capacity
4. Verify that Supabase AU meets data sovereignty requirements for a Tasmanian government business entity
5. Check if Supabase Pro plan (or higher) is required for AU region hosting

**Deliverable**: Cost comparison document — Azure current cost vs Supabase AU estimated cost, with compliance notes.

**Urgency**: Medium — needed for architecture decision but not blocking deep-dive.

---

### T6. Test Cell-Reference Preservation in Migration

**Objective**: Verify that ERIC's cell-reference-based data structure survives migration to a new database.

**Steps**:
1. Take a sample of the MAST data (if accessible) or use reference data from another ERIC client
2. Migrate the sample data to a test Supabase instance
3. Verify that cell references are preserved and functional
4. Test that reports generated from migrated data match the originals
5. Document any reference breakage or data loss

**Deliverable**: Test results document — "Cell references [are/are not] preserved after migration; these N issues were found: [list]"

**Dependency**: Requires T1 and T3 to be complete first.

---

## Investigation Summary

| # | Investigation | Deliverable | Deadline | Depends On |
|---|--------------|-------------|----------|------------|
| T1 | Azure DB separation | Written confirmation | Before deep-dive | Azure access |
| T2 | Formula export integrity | Integrity assessment | Before deep-dive | Azure access |
| T3 | Variable file mapping | Schema diagram | Before deep-dive | Martin's docs (ERIC folders) |
| T4 | Data tree mapping | Data flow diagram | Before deep-dive | Martin's docs (ERIC folders) |
| T5 | Supabase AU pricing/compliance | Cost comparison | Before architecture decision | None |
| T6 | Cell-reference preservation | Test results | Before build starts | T1, T3 |

---

## Dependencies Diagram

```
Martin: Share ERIC documentation
  └── T3: Map variable file structure
  └── T4: Map data tree structure

Azure access (confirmed)
  └── T1: Validate MAST/ERIC Azure DB
      └── T6: Test cell-reference migration
  └── T2: Export Azure formulas

T1 + T2 + T3 + T4
  └── Architecture decision at deep-dive session

T5 (independent)
  └── Feeds into architecture decision
```

---

## Reporting Format

For each investigation item, Pradeep should produce a short written document with:

1. **Finding**: What was discovered
2. **Evidence**: Screenshots, data exports, or command outputs
3. **Impact**: How this affects the architecture decision
4. **Recommendation**: What Pradeep recommends based on findings

Place completed investigation reports in `../data/` or link from this document.

---

## Access Requirements

| Resource | Current Status | Action Needed |
|----------|---------------|---------------|
| Azure portal | Pradeep has access (verbal confirmation) | Confirm in writing (Action Item #8 from Session 2) |
| ERIC database | Unknown | Validate access as part of T1 |
| Martin's ERIC folders | Not yet shared | Martin to share via shared drive |
| Supabase account | Team has existing account | No action needed |

---

## Escalation

If any investigation reveals a **blocking issue** (e.g., formulas cannot be exported, Azure DB is shared with Jigsaw in a way that prevents separation), Pradeep should:

1. Document the issue immediately
2. Notify Nicolas (do not wait for the deep-dive session)
3. Propose at least one alternative approach

**Critical finding from Session 3**: Nicolas stated his understanding that the existing Azure DB export covers Jigsaw, not ERIC. Martin agreed this needed investigation. This is T1's primary question.
