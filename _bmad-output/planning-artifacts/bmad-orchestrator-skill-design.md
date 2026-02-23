# BMAD Orchestrator Skill — Design Specification

**Date:** 2026-02-23
**Purpose:** Technical specification for building a BMAD v6 orchestrator skill for Claudia (OpenClaw). Covers edge cases, gate logic, and reinforcement learning metrics.

---

## Table of Contents

1. [Workflow Dependencies & Edge Cases Beyond the CSV](#1-workflow-dependencies--edge-cases-beyond-the-csv)
2. [Gate Logic — How Validation Determines Pass/Fail](#2-gate-logic--how-validation-determines-passfail)
3. [Reinforcement Learning Metrics](#3-reinforcement-learning-metrics)

---

## 1. Workflow Dependencies & Edge Cases Beyond the CSV

The CSV captures the happy path. These are the runtime behaviours the orchestrator must handle.

### 1.1 Conditional Workflow Execution

BMAD workflows use `<check if="...">` blocks that branch based on runtime state. The orchestrator cannot treat the pipeline as a fixed sequence — it must handle dynamic routing.

#### Dev-Story Input Discovery (3 branches)

```
IF story_path is explicitly provided:
    → Use it directly, skip discovery

ELSE IF sprint-status.yaml exists:
    → Find FIRST story where status = "ready-for-dev"
    → IF none found:
        → HALT — must run create-story first
        → Offers 4 choices to user (create next story, pick specific, etc.)

ELSE IF sprint-status.yaml does NOT exist:
    → Search story directory for story files directly
    → Fall back to manual selection
```

**Orchestrator implication:** Before spawning a dev-story agent, verify `sprint-status.yaml` exists AND has at least one `ready-for-dev` story. If not, route to create-story first.

#### Code Review Outcome Routing (2 branches)

```
IF all HIGH and MEDIUM issues fixed AND all ACs implemented:
    → new_status = "done"
    → Story complete, proceed to next story

ELSE IF HIGH or MEDIUM issues remain OR ACs not fully implemented:
    → new_status = "in-progress"
    → Story returns to dev-story for fixes
```

**Orchestrator implication:** After code review, parse the review output for status. Don't assume approval.

#### Create Story Epic Status Guard

```
IF epic status == "done":
    → HALT — cannot create stories in a completed epic

IF epic status == "backlog":
    → Auto-transition to "in-progress"

IF epic status == "contexted" (legacy):
    → Auto-transition to "in-progress"
```

**Orchestrator implication:** Before creating a story, check epic status in `sprint-status.yaml`. Reject requests to add stories to completed epics.

### 1.2 Implicit Dependencies Not in the CSV

| Scenario | Dependency | What Happens |
|---|---|---|
| Create Story needs previous stories | Loads ALL prior story files for the same epic | Context about what was already built, patterns established, lessons learned |
| Create Story does web research | Calls web search for latest tech versions | May fail in air-gapped environments; orchestrator should handle gracefully |
| Dev Story needs project-context.md | Globs for `**/project-context.md` | If missing, dev agent works without codebase context — quality degrades |
| Code Review needs git diff | Runs `git diff` against the story's file list | Requires the dev-story session to have committed changes |
| Sprint Planning auto-detects story status | Checks if story files already exist on disk | Pre-existing files cause status upgrades (backlog → ready-for-dev) |

### 1.3 Conditional Workflows Based on Project Type

The CSV doesn't encode these, but they're implied by the workflow descriptions:

| Workflow | Condition | Skip If |
|---|---|---|
| Create UX Design | Project has a UI | No UI component (pure API, CLI tool, library) |
| QA Automation Test | Test framework exists | No test framework configured (like Jigsaw currently) |
| NFR Assessment (TEA) | Performance/security matters | Prototype or internal tool |
| Retrospective | Epic is complex enough | Single-story epic or trivial epic |
| Validate Brief / PRD / Architecture | Project is complex | Small feature, quick-flow scope |

**Orchestrator rule:** For optional workflows, check project metadata (from config.yaml or PRD) to decide. Default to including them for complex projects, skipping for quick-flow.

### 1.4 HALT Conditions (Pipeline Blockers)

Several workflows define HALT conditions that stop all forward progress:

| Workflow | HALT Trigger | Required Action |
|---|---|---|
| Dev Story | No ready-for-dev stories found | Run create-story |
| Dev Story | Story file has no tasks/subtasks | Return to create-story for re-generation |
| Code Review | Cannot access git history | Ensure dev agent committed changes |
| Correct Course | Trigger is unclear or no evidence provided | Human must provide context |
| Correct Course | User approval not obtained | Human decision required |
| Create Story | Target epic is status "done" | Cannot proceed — epic is closed |

**Orchestrator pattern:** Implement HALT as an escalation to human with context about what's needed. Don't retry the same workflow — route to the prerequisite.

### 1.5 The Correct Course Escape Hatch

`/bmad-bmm-correct-course` (Bob, SM) is a special "anytime" workflow that breaks the normal sequence. It can recommend:

- Starting over from scratch
- Updating the PRD
- Redoing architecture
- Re-planning the sprint
- Correcting epics and stories

**Orchestrator implication:** After any workflow failure or human escalation, offer correct-course as an option. If executed, its output determines which phase to jump back to — potentially unwinding completed phases.

---

## 2. Gate Logic — How Validation Determines Pass/Fail

BMAD uses four distinct validation patterns. The orchestrator must implement all four.

### 2.1 Pattern A — Binary Checklist (All-or-Nothing)

**Used by:** Dev Story Definition of Done, Sprint Planning, Create Story

Every item must be checked. Any unchecked item = FAIL.

#### Dev Story Checklist (23 items across 5 categories)

```
Category 1: Context & Requirements (4 items)
  [ ] Story context completeness verified
  [ ] Architecture compliance confirmed
  [ ] Technical specs addressed
  [ ] Previous story learnings incorporated

Category 2: Implementation Completion (4 items)
  [ ] All tasks marked [x] complete
  [ ] All Acceptance Criteria satisfied
  [ ] No ambiguous implementations remain
  [ ] Edge cases handled, dependencies resolved

Category 3: Testing & Quality Assurance (6 items)
  [ ] Unit tests written and passing
  [ ] Integration tests written and passing
  [ ] E2E tests written and passing
  [ ] Test coverage meets threshold
  [ ] Regression prevention verified
  [ ] Code quality standards met

Category 4: Documentation & Tracking (5 items)
  [ ] File List complete and accurate
  [ ] Dev Agent Record updated
  [ ] Change Log updated
  [ ] Review follow-ups addressed
  [ ] Story structure compliance maintained

Category 5: Final Status Verification (4 items)
  [ ] Story status updated correctly
  [ ] Sprint status updated correctly
  [ ] Quality gates passed
  [ ] No HALT conditions active
```

**Gate output format:**
```
Definition of Done: PASS | FAIL
Completion Score: 21/23 items passed
Quality Gates: PASS | FAIL
```

**Orchestrator implementation:**
```python
def evaluate_checklist_gate(checklist_results: dict) -> GateResult:
    """All-or-nothing checklist evaluation."""
    total = sum(len(items) for items in checklist_results.values())
    passed = sum(
        1 for items in checklist_results.values()
        for item in items if item.checked
    )

    return GateResult(
        status="PASS" if passed == total else "FAIL",
        score=f"{passed}/{total}",
        failures=[item for items in checklist_results.values()
                  for item in items if not item.checked],
    )
```

#### Sprint Planning Checklist (7 items)

```
[ ] Every epic in epic files appears in sprint-status.yaml
[ ] Every story in epic files appears in sprint-status.yaml
[ ] Every epic has a corresponding retrospective entry
[ ] No orphan items in sprint-status.yaml
[ ] Total epic count matches
[ ] Total story count matches
[ ] All items in expected order (epic, stories, retrospective)
```

### 2.2 Pattern B — Scoring with Thresholds

**Used by:** PRD Validation (SMART scores, holistic quality, completeness)

#### SMART Scoring (per Functional Requirement)

Each FR scored on 5 dimensions, 1-5 scale:

| Dimension | Question | Threshold |
|---|---|---|
| **S**pecific | Is it clear and detailed? | < 3 = flagged |
| **M**easurable | Can success be measured? | < 3 = flagged |
| **A**ttainable | Is it realistic? | < 3 = flagged |
| **R**elevant | Does it align with goals? | < 3 = flagged |
| **T**raceable | Can it be linked to tests? | < 3 = flagged |

**Aggregate metrics:**
- % of FRs with all scores >= 3 (minimum quality)
- % of FRs with all scores >= 4 (good quality)
- Average SMART score across all FRs

#### Holistic Quality Rating (PRD as a whole)

```
5 = Excellent  → PASS
4 = Very Good  → PASS
3 = Good       → PASS with warnings
2 = Fair       → FAIL — needs rework
1 = Poor       → FAIL — major rewrite needed
```

#### Completeness Percentage

```
>= 90%: PASS
75-89%: WARNING — address gaps soon
< 75%:  FAIL — critical sections missing
```

**Severity levels for missing content:**
- **Critical:** Template variables still present OR critical sections missing → MUST fix
- **Warning:** Minor gaps → address for completeness
- **Pass:** All required sections present

**Overall PRD Validation Status:**
```
PASS:     All critical checks pass, minor warnings acceptable
WARNING:  Some issues found but PRD is usable
CRITICAL: Major issues, PRD not fit for purpose
```

**Orchestrator implementation:**
```python
def evaluate_prd_gate(validation_report: dict) -> GateResult:
    """Multi-dimensional PRD scoring."""
    smart_avg = validation_report["smart_average"]
    holistic = validation_report["holistic_rating"]
    completeness = validation_report["completeness_pct"]

    # Any critical = FAIL
    if validation_report["critical_issues"] > 0:
        return GateResult(status="CRITICAL", ...)

    # Scoring thresholds
    if smart_avg < 3.0 or holistic < 3 or completeness < 75:
        return GateResult(status="FAIL", ...)

    if smart_avg < 4.0 or holistic < 4 or completeness < 90:
        return GateResult(status="WARNING", ...)

    return GateResult(status="PASS", ...)
```

### 2.3 Pattern C — Deterministic Gate Rules

**Used by:** TEA Test Architecture (Traceability Gate)

Hard-coded if/then rules with no subjective judgment:

| Rule | Condition | Decision |
|---|---|---|
| Rule 1 | P0 coverage < 100% | **FAIL** |
| Rule 2 | P0 = 100% AND overall >= 90% | **PASS** |
| Rule 3 | P0 = 100% AND 75% <= overall < 90% | **CONCERNS** |
| Rule 4 | P0 = 100% AND overall < 75% | **FAIL** |
| Rule 5 | Manual waiver flag = true | **WAIVED** |

**Gate output:**
```yaml
gate_criteria:
  p0_coverage_required: "100%"
  p0_coverage_actual: "{percentage}%"
  p0_status: "MET" | "NOT MET"
  overall_coverage_target: "90%"
  overall_coverage_actual: "{percentage}%"
  overall_status: "MET" | "PARTIAL" | "NOT MET"
```

**Actions by decision:**
- **PASS:** Release approved
- **CONCERNS:** Proceed with caution, address gaps
- **FAIL:** Release BLOCKED

**Orchestrator implementation:**
```python
def evaluate_deterministic_gate(metrics: dict) -> GateResult:
    """Hard threshold gate — no judgment needed."""
    p0 = metrics["p0_coverage"]
    overall = metrics["overall_coverage"]

    if metrics.get("manual_waiver"):
        return GateResult(status="WAIVED")
    if p0 < 100:
        return GateResult(status="FAIL", reason="P0 < 100%")
    if overall >= 90:
        return GateResult(status="PASS")
    if overall >= 75:
        return GateResult(status="CONCERNS")
    return GateResult(status="FAIL", reason=f"Overall {overall}% < 75%")
```

### 2.4 Pattern D — Adversarial Review (Findings-Based)

**Used by:** Code Review, Adversarial Review (General)

No score. Instead, the reviewer must find a minimum number of issues, categorised by severity. The outcome depends on what remains after fixes.

#### Code Review Finding Categories

| Severity | Label | Examples | Gate Impact |
|---|---|---|---|
| **HIGH** | Must fix | Tasks marked [x] but not implemented; ACs missing; security vulnerabilities; story claims files but no git evidence | **Blocks PASS** |
| **MEDIUM** | Should fix | Files changed but not in File List; uncommitted changes; performance problems; poor test coverage | **Blocks PASS** |
| **LOW** | Nice to fix | Code style; documentation gaps; git commit quality | Does not block |

**Mandatory:** Find 3-10 specific issues per review minimum. No "looks good" passes allowed.

**Gate determination:**
```
PASS  = zero HIGH + zero MEDIUM remaining (after fix round)
FAIL  = any HIGH or MEDIUM remaining, OR ACs not implemented
```

**Orchestrator implementation:**
```python
def evaluate_adversarial_gate(review: dict) -> GateResult:
    """Findings-based gate — HIGH/MEDIUM block passage."""
    high = [f for f in review["findings"] if f.severity == "HIGH"]
    medium = [f for f in review["findings"] if f.severity == "MEDIUM"]

    if high or medium:
        return GateResult(
            status="FAIL",
            action="return_to_dev",
            findings=high + medium,
        )

    return GateResult(status="PASS", new_story_status="done")
```

### 2.5 Gate Pattern Summary (Orchestrator Quick Reference)

| Workflow | Pattern | Pass Condition | Fail Action |
|---|---|---|---|
| Sprint Planning | A (Checklist) | 7/7 items checked | Regenerate sprint status |
| Create Story | A (Checklist) | All context items verified | Re-run with more context |
| Dev Story DoD | A (Checklist) | 23/23 items checked | Continue implementation |
| Code Review | D (Adversarial) | 0 HIGH + 0 MEDIUM remaining | Return to dev-story |
| PRD Validation | B (Scoring) | SMART avg >= 3, holistic >= 3, completeness >= 75% | Return to create-prd |
| Architecture Validation | A (Checklist) | All sections complete | Return to create-architecture |
| Readiness Check | A (Checklist) | PRD + Arch + Epics aligned | Fix identified gaps |
| TEA Traceability | C (Deterministic) | P0 = 100% + overall >= 90% | Expand test coverage |

---

## 3. Reinforcement Learning Metrics

### 3.1 Per-Workflow Execution Metrics

These should be captured every time a workflow runs:

#### Universal Metrics (all workflows)

| Metric | Type | What It Measures |
|---|---|---|
| `execution_duration_ms` | Timer | Wall clock time from prompt to artifact |
| `model_used` | String | Which LLM executed the workflow |
| `token_count_input` | Integer | Prompt size (indicates context efficiency) |
| `token_count_output` | Integer | Response size |
| `gate_result` | Enum | PASS / FAIL / WARNING / CONCERNS / WAIVED |
| `gate_score` | String | e.g., "21/23" or "9.2/10" or "87%" |
| `human_intervention_required` | Boolean | Did the orchestrator escalate to human? |
| `human_intervention_reason` | String | Why (if applicable) |
| `halt_triggered` | Boolean | Did a HALT condition fire? |
| `halt_reason` | String | Which HALT and why |

#### Planning Phase Metrics

| Metric | Type | Relevance |
|---|---|---|
| `prd_smart_avg` | Float | Average SMART score across all FRs |
| `prd_completeness_pct` | Float | % of required sections complete |
| `prd_holistic_rating` | Integer (1-5) | Overall document quality |
| `prd_frs_below_threshold` | Integer | Count of FRs with any score < 3 |
| `architecture_sections_complete` | Fraction | e.g., "8/8" |
| `epics_count` | Integer | Total epics generated |
| `stories_count` | Integer | Total stories generated |
| `readiness_gaps_found` | Integer | Misalignments between PRD/Arch/Epics |

#### Implementation Phase Metrics

| Metric | Type | Relevance |
|---|---|---|
| `story_tasks_total` | Integer | How many tasks in the story |
| `story_tasks_completed` | Integer | How many marked [x] |
| `cr_iterations` | Integer | **Key metric** — how many CR → DS loops before PASS |
| `cr_findings_high` | Integer | HIGH severity issues found |
| `cr_findings_medium` | Integer | MEDIUM severity issues found |
| `cr_findings_low` | Integer | LOW severity issues found |
| `cr_findings_total` | Integer | Total findings (should be >= 3) |
| `tests_passing` | Boolean | All tests pass at story completion |
| `files_changed` | Integer | Number of files in story File List |
| `git_commits` | Integer | Number of commits for this story |
| `story_file_completeness` | Fraction | Sections filled / total sections |

### 3.2 Aggregate Metrics (Per Sprint / Per Epic / Per Project)

| Metric | Calculation | What It Reveals |
|---|---|---|
| `avg_cr_iterations` | Mean of `cr_iterations` across stories | Code quality trend — decreasing = model is learning patterns |
| `first_pass_rate` | % of stories that pass CR on first attempt | Quality of create-story + dev-story pipeline |
| `avg_story_duration` | Mean of `execution_duration_ms` for DS workflow | Execution speed baseline per model |
| `halt_rate` | % of workflow executions that triggered HALT | Pipeline health — high rate = planning gaps |
| `human_escalation_rate` | % of workflows requiring human intervention | Automation maturity — should decrease over time |
| `gate_pass_rate_by_workflow` | % PASS per workflow type | Identifies weakest workflow in the pipeline |
| `model_comparison_matrix` | Score metrics grouped by `model_used` | Direct A/B comparison for model benchmarking |
| `rework_cost` | Sum of token costs for CR → DS fix loops | Wasted spend that better planning would prevent |
| `planning_to_implementation_ratio` | Token cost of phases 1-3 / token cost of phase 4 | BMAD thesis: more planning = less rework |

### 3.3 Failure Pattern Tracking

Track recurring failure patterns to feed back into the pipeline:

```yaml
failure_patterns:
  - pattern_id: "FP-001"
    description: "Dev agent marks tasks [x] without full implementation"
    detection: "Code review consistently finds HIGH: task-not-implemented"
    frequency: 3  # occurrences
    affected_model: "glm-5"
    mitigation: "Add explicit verification step to dev-story prompt"
    status: "active"

  - pattern_id: "FP-002"
    description: "Story file missing architecture constraints"
    detection: "Dev agent violates architecture patterns"
    frequency: 2
    affected_workflow: "create-story"
    mitigation: "Increase architecture loading from SELECTIVE to FULL"
    status: "mitigated"

  - pattern_id: "FP-003"
    description: "PRD functional requirements not measurable"
    detection: "SMART 'M' score consistently < 3"
    frequency: 5
    affected_model: "minimax-2.5"
    mitigation: "Use high-capability model for PRD, or add measurability prompt"
    status: "active"
```

### 3.4 Learning Loop Architecture

```
                    ┌──────────────────────────────┐
                    │   Claudia (Orchestrator)      │
                    │                               │
                    │  1. Select workflow            │
                    │  2. Choose model (informed     │
                    │     by historical metrics)     │
                    │  3. Assemble prompt            │
                    │  4. Dispatch to sub-agent      │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
                    │   Sub-Agent Execution          │
                    │   (persona + instructions +    │
                    │    input content)              │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
                    │   Gate Evaluation              │
                    │   (Pattern A/B/C/D)           │
                    └──────────┬───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼──────┐
        │   PASS     │   │  WARNING   │   │   FAIL     │
        │            │   │            │   │            │
        │ Log metrics│   │ Log metrics│   │ Log metrics│
        │ Next wflow │   │ Human flag │   │ Route fix  │
        └────────────┘   └────────────┘   └─────┬──────┘
                                                │
                                     ┌──────────▼──────────┐
                                     │  Failure Analysis     │
                                     │                       │
                                     │  - Match to known     │
                                     │    failure patterns    │
                                     │  - Update pattern DB   │
                                     │  - Adjust model        │
                                     │    selection for       │
                                     │    future runs         │
                                     │  - Modify prompt       │
                                     │    assembly if needed  │
                                     └───────────────────────┘
```

### 3.5 Model Selection Feedback

The learning loop should inform model selection over time:

```python
def select_model(workflow_code: str, story_complexity: str) -> str:
    """Select model based on historical performance."""

    history = get_workflow_metrics(workflow_code)

    # For code review, always use high-capability
    if workflow_code == "CR":
        return "claude-opus"

    # Check historical first-pass rate by model
    for model in available_models:
        model_metrics = history.filter(model=model)
        if model_metrics.first_pass_rate > 0.8 and model_metrics.avg_cr_iterations < 1.5:
            return model  # This model performs well enough

    # Default to high-capability if no model has proven track record
    return "claude-opus"
```

### 3.6 Metrics BMAD's Design Specifically Suggests

Based on patterns embedded in the workflow files themselves:

| Metric | Source | Why BMAD Cares |
|---|---|---|
| **Story context quality score** | Create-story checklist uses "competitive excellence" framing — it scores how many gaps the story creator found vs what was available | Measures whether create-story is doing its job as a "mistake preventer" |
| **Git vs story discrepancy count** | Code review explicitly checks File List vs actual git diff | Measures dev agent honesty — does it claim to have changed files it didn't? |
| **AC implementation verification rate** | Code review checks each AC individually | Measures whether dev agent actually builds what the story asks for |
| **Task checkbox integrity** | Code review verifies [x] marks against actual code | Catches "check and move on" laziness in dev agents |
| **Prevention effectiveness** | Stories with 0 HIGH CR findings / total stories | The core BMAD thesis: better stories → fewer bugs |
| **Checklist pass breakdown by category** | Dev story DoD has 5 categories with separate counts | Identifies systemic weakness (e.g., testing always fails) |
| **Template variable remnants** | PRD validation checks for unfilled `{{variables}}` | Measures agent completeness — did it actually fill in everything? |

### 3.7 Recommended Storage Format

```yaml
# _bmad-output/metrics/execution-log.yaml
executions:
  - id: "exec-001"
    timestamp: "2026-02-23T14:30:00Z"
    project: "jigsaw-1.6-rsa"
    workflow: "dev-story"
    workflow_code: "DS"
    story_key: "1-2-user-authentication"
    model: "claude-opus-4-6"

    timing:
      duration_ms: 45000
      tokens_in: 12500
      tokens_out: 8300

    gate:
      pattern: "checklist"
      result: "FAIL"
      score: "19/23"
      failures:
        - category: "testing"
          item: "E2E tests written and passing"
        - category: "testing"
          item: "Test coverage meets threshold"
        - category: "documentation"
          item: "File List complete and accurate"
        - category: "status"
          item: "Quality gates passed"

    routing:
      action: "continue_implementation"
      next_workflow: "dev-story"  # Same workflow — fix and retry

    failure_patterns_matched: ["FP-001"]
    human_intervention: false

# _bmad-output/metrics/failure-patterns.yaml
patterns:
  - id: "FP-001"
    description: "Dev agent skips test writing"
    detection_query: "gate.failures[].item contains 'test'"
    occurrences: 3
    affected_models: ["glm-5", "minimax-2.5"]
    not_affected: ["claude-opus-4-6"]
    mitigation: "Add explicit test-writing prompt reinforcement"
    status: "active"
    first_seen: "2026-02-23"
    last_seen: "2026-02-23"

# _bmad-output/metrics/model-benchmarks.yaml
benchmarks:
  claude-opus-4-6:
    workflows_executed: 12
    first_pass_rate: 0.83
    avg_cr_iterations: 1.2
    avg_duration_ms: 52000
    gate_pass_rate:
      dev-story: 0.80
      code-review: 0.90
      create-story: 1.00
    total_tokens: 245000
    cost_estimate_usd: 12.50

  kimi-k2.5:
    workflows_executed: 8
    first_pass_rate: 0.62
    avg_cr_iterations: 2.1
    avg_duration_ms: 38000
    gate_pass_rate:
      dev-story: 0.50
      code-review: 0.75
      create-story: 0.88
    total_tokens: 189000
    cost_estimate_usd: 3.20
```

---

## Appendix A — Gate Evaluation Quick Reference

```python
def evaluate_gate(workflow_code: str, output: dict) -> GateResult:
    """Universal gate evaluator — routes to correct pattern."""

    CHECKLIST_WORKFLOWS = {"SP", "CS", "VS", "DS", "CA", "CE", "IR"}
    SCORING_WORKFLOWS = {"VP", "VB", "VU", "VA", "VE"}
    DETERMINISTIC_WORKFLOWS = {"TR"}  # TEA traceability
    ADVERSARIAL_WORKFLOWS = {"CR", "AR"}

    if workflow_code in CHECKLIST_WORKFLOWS:
        return evaluate_checklist_gate(output)
    elif workflow_code in SCORING_WORKFLOWS:
        return evaluate_scoring_gate(output)
    elif workflow_code in DETERMINISTIC_WORKFLOWS:
        return evaluate_deterministic_gate(output)
    elif workflow_code in ADVERSARIAL_WORKFLOWS:
        return evaluate_adversarial_gate(output)
    else:
        # Anytime workflows — no formal gate
        return GateResult(status="NO_GATE", score="N/A")
```

## Appendix B — Workflow Routing State Machine

```
                        ┌─────────────┐
                        │  START      │
                        └──────┬──────┘
                               │
                ┌──────────────▼──────────────┐
                │  Phase 1: Analysis           │
                │  (all optional)              │
                │  BP → MR → DR → TR → CB → VB│
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │  Phase 2: Planning           │
                │  CP [REQUIRED] → VP → CU → VU│
                └──────────────┬──────────────┘
                               │ gate: PRD exists
                ┌──────────────▼──────────────┐
                │  Phase 3: Solutioning        │
                │  CA [REQ] → VA → CE [REQ]   │
                │  → VE → IR [REQ]            │
                └──────────────┬──────────────┘
                               │ gate: Readiness PASS
                ┌──────────────▼──────────────┐
                │  Phase 4: Implementation     │
                │  SP [REQ] → story loop       │
                └──────────────┬──────────────┘
                               │
           ┌───────────────────▼───────────────────┐
           │              STORY LOOP                │
           │                                        │
           │  CS [REQ] ──→ VS ──→ DS [REQ] ──→ CR │
           │    ▲                    ▲          │   │
           │    │                    └──── FAIL ┘   │
           │    │                                   │
           │    └── next story ◄── PASS ────────┘   │
           │                                        │
           │  When all stories in epic done:         │
           │    → ER (optional retrospective)       │
           │    → next epic or SPRINT COMPLETE      │
           └────────────────────────────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │  ANYTIME (escape hatches)    │
                │  CC: Correct Course          │
                │  QS: Quick Spec              │
                │  QD: Quick Dev               │
                │  SS: Sprint Status           │
                └─────────────────────────────┘
```
