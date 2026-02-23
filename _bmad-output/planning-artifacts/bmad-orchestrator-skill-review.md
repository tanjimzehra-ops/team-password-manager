# BMAD Orchestrator Skill — Technical Review

**Date:** 2026-02-23
**Reviewer:** Claude Opus (cross-referencing skill files against actual BMAD v6 workflow internals)
**Skill location:** `/Users/nicolaspt/claudia-2.0/skills/bmad-orchestrator/`
**Verdict:** Strong foundation. 3 issues that will cause runtime failures, 4 that will degrade quality, 2 structural improvements recommended.

---

## Answers to Your 6 Specific Questions

### Q1. Did I get the gate pattern assignments right?

**No. Two assignments are wrong.**

#### Issue 1: VA (Validate Architecture) — assigned Pattern A, should be Pattern B

Your `gates.md` assigns VA to Pattern A (Binary Checklist). The analysis doc grouped it with Pattern B (Scoring). Here's what the actual files show:

The `create-architecture` workflow uses a **micro-file collaborative discovery process** — step-by-step with user approval at each step. It's neither a simple checklist nor a scoring rubric for the *creation* workflow.

However, VA is the **Validate Mode** of that same workflow (see CSV: `options` column = "Validate Mode"). Validation workflows in BMAD follow the same pattern as PRD validation — they produce scoring reports with dimensional ratings, not binary checklists.

**Fix:** Move VA from Pattern A to Pattern B in `gates.md`. The evaluator dispatch should be:

```
CHECKLIST_WORKFLOWS = {"SP", "CS", "VS", "DS", "CE", "IR"}  # Remove CA, add CE back
SCORING_WORKFLOWS = {"VP", "VB", "VU", "VA", "VE"}          # VA stays here
```

Note: `CA` (Create Architecture) is not a validation — it's a creation workflow. It doesn't have a formal gate in the traditional sense. The gate for architecture is `VA` (Validate Architecture) and `IR` (Implementation Readiness).

#### Issue 2: IR (Implementation Readiness) — Pattern A is mostly correct but incomplete

IR is a multi-step validation that checks alignment between PRD, Architecture, and Epics. It uses the micro-file design pattern (one step at a time, sequential enforcement). The output IS checklist-like, but it also produces a gap analysis with severity levels. Pattern A is a workable approximation, but be aware that IR findings may have severity (critical vs warning) similar to Pattern D.

**Recommendation:** Keep IR as Pattern A but add a secondary check: if any IR finding is flagged "critical," treat the gate as FAIL regardless of checklist count.

---

### Q2. Is the story loop state machine correct?

**Mostly correct. One gap between epics.**

Your state machine: `all stories done → ER (retro) → next epic` is missing the **Significant Discovery Gate**.

The retrospective workflow (Step 8) includes a **Significant Change Detection** mechanism that checks for:
- Architectural assumptions proven wrong
- Major scope changes needed
- Technical approach needs fundamental change
- Dependencies the next epic doesn't account for
- Performance/scalability concerns discovered
- Security/compliance issues found
- Integration assumptions proven incorrect
- Technical debt level unsustainable

If any of these are detected, the retrospective triggers a **"Schedule Epic N+1 Planning Review"** — meaning the pipeline must PAUSE before starting the next epic.

**Your state machine should be:**

```
all stories in epic done
  → ER (retrospective)
  → IF significant_discoveries:
      → PAUSE: human reviews + planning session for next epic
      → May trigger CC (Correct Course) for artifact updates
      → Resume when human approves
  → ELSE:
      → next epic (CS for first story)
```

Additionally, the retrospective includes a **Preparation Sprint** concept (Step 12): critical-path items that must complete before the next epic can start (technical setup, refactoring, dependency resolution). Your loop should account for these prep tasks.

**Fix in `router.md`:** Add a `retrospective_outcome` field to pipeline state:

```yaml
story_loop:
  current_epic: "epic-2"
  retrospective:
    status: "complete"
    significant_discoveries: true    # NEW
    prep_tasks_remaining: 2          # NEW
    blocked_until_human_review: true  # NEW
```

---

### Q3. Am I loading the right inputs for each workflow?

**Two corrections needed.**

#### CS (Create Story) — You're missing git intelligence and web research

Your skill lists: `epics + architecture + UX + ALL previous stories + sprint-status`

The actual `create-story/instructions.xml` Step 2-4 loads:
- Epics (primary, SELECTIVE_LOAD for target epic)
- PRD (fallback for requirements if epics lack detail)
- Architecture (SELECTIVE — relevant sections for developer guardrails)
- UX spec (if UI story)
- Sprint-status.yaml
- **ALL previous story files for the same epic** (correct, you have this)
- **project-context.md** (you're missing this)
- **Git intelligence** — analyses recent git history for patterns, conventions, file structure
- **Web research** — fetches latest versions of libraries/frameworks mentioned in the story

**Fix:** Add `project-context.md` and `git log --oneline -20` output to CS inputs. Web research is a sub-agent capability (the CS agent does it itself during execution), so you don't need to pre-load it — but you should note in the prompt that the agent has web access.

#### CR (Code Review) — You're under-loading significantly

Your skill lists: `story file + git diff + File List files`

The actual `code-review/workflow.yaml` loads via `input_file_patterns`:
- Story file (primary)
- **Architecture — FULL_LOAD** (entire architecture document)
- **UX design — FULL_LOAD** (entire UX spec)
- **Epics — SELECTIVE_LOAD** (the epic containing the story under review)
- **project-context.md**
- Git diff (via shell execution during review)
- All files in File List (read during review)

**This is a critical gap.** Without the architecture and UX spec, the code reviewer can't verify architectural compliance or UI correctness. The adversarial review would miss an entire category of findings.

**Fix in `prompt-assembler.md`:** Update the CR template:

```
CR inputs:
  REQUIRED:
    - story_file: the story being reviewed
    - git_diff: output of git diff for the story's changes
    - file_list_files: content of every file in the story's File List
  REQUIRED (currently missing):
    - architecture: FULL_LOAD from {planning_artifacts}/*architecture*
    - ux_design: FULL_LOAD from {planning_artifacts}/*ux* (if UI story)
    - epic: SELECTIVE_LOAD for the parent epic
    - project_context: project-context.md
```

#### DS (Dev Story) — Correct as-is

Your assessment is right. DS loads story file + project-context.md only. Architecture is loaded transitively through the story's Dev Notes section (created by CS). This is by design — the story file is meant to be a self-contained development contract.

---

### Q4. Is "rewind pipeline state" the right model for Correct Course?

**No. CC is more nuanced than a simple rewind.**

The actual Correct Course output is a **Sprint Change Proposal** with 5 sections:
1. Issue Summary
2. Impact Analysis (epic impact, story impact, artifact conflicts, technical impact)
3. Recommended Approach (one of three paths)
4. Detailed Change Proposals (specific before/after edits per artifact)
5. Implementation Handoff

The handoff routing depends on **scope classification**:

| Scope | Handoff Target | Pipeline Action |
|---|---|---|
| **Minor** | Development team | Continue sprint, apply fixes inline |
| **Moderate** | Product Owner / Scrum Master | Pause sprint, reorganise backlog, may resequence stories |
| **Major** | Product Manager / Solution Architect | Full replanning — may rewind to Phase 2 (PRD) or Phase 3 (Architecture) |

**Your "rewind pipeline state to the phase specified in CC output" only covers the Major scope.** Minor and Moderate don't rewind at all — they adjust within the current phase.

**Fix in `router.md`:**

```yaml
correct_course_handling:
  minor:
    action: "continue_sprint"
    pipeline_rewind: false
    apply_edits: true         # Apply change proposals to affected artifacts
    resume_from: "current_story"
  moderate:
    action: "pause_sprint"
    pipeline_rewind: false
    reorganise_backlog: true   # Re-order stories, may add/remove stories
    resume_from: "sprint_planning"  # Re-run SP with updated epics
    requires_human_approval: true
  major:
    action: "rewind_pipeline"
    pipeline_rewind: true
    rewind_to: "determined_by_cc_output"  # Could be Phase 2 or Phase 3
    invalidate_artifacts: true  # Mark affected artifacts as stale
    requires_human_approval: true
```

---

### Q5. Anything missing entirely?

**Yes. Three gaps.**

#### Gap 1: Micro-File Step Execution

Several BMAD workflows (create-architecture, check-implementation-readiness, create-prd) use a **micro-file design pattern**:
- Instructions are split into separate step files (step-01.md, step-02.md, etc.)
- Only ONE step file is loaded at a time
- Each step must complete before the next is loaded
- Steps have their own embedded rules and menus
- State is tracked in output file frontmatter via `stepsCompleted` array

Your prompt-assembler loads `instructions.xml` as a single file. For micro-file workflows, this is the wrong approach. The instructions.xml is just the dispatcher — the actual content is in individual step files.

**Options:**
- **A (Simple):** For planning workflows that use micro-file design, load ALL step files and concatenate them. Loses the token efficiency of just-in-time loading, but works for single-session execution.
- **B (Faithful):** Have the sub-agent execute steps sequentially, loading one at a time. Requires the sub-agent to have filesystem access (which OpenClaw provides via exec).
- **C (Hybrid):** Pre-load and concatenate for sub-agents without filesystem access; use Option B for sub-agents that have it.

**Recommendation:** Option A for OpenClaw. The micro-file pattern was designed to conserve context in interactive sessions. For automated execution where the orchestrator manages context, pre-loading all steps is simpler and just as effective.

#### Gap 2: Sprint Status as Source of Truth

Your router reads `pipeline-state.yaml` for routing decisions. But BMAD's actual source of truth for implementation phase routing is `sprint-status.yaml`. These can drift apart.

**Risk:** If a dev-story session updates sprint-status.yaml (marking a story `done`) but pipeline-state.yaml isn't updated (because the orchestrator didn't receive the signal), the router will try to re-execute a completed story.

**Fix:** The router should ALWAYS read `sprint-status.yaml` for Phase 4 decisions, not rely solely on `pipeline-state.yaml`. Use pipeline-state.yaml for phase-level tracking (which phase are we in?) and sprint-status.yaml for story-level tracking (which story is next?).

```
Phase-level routing → pipeline-state.yaml (orchestrator maintains)
Story-level routing → sprint-status.yaml (workflows maintain)
```

#### Gap 3: Party Mode / Multi-Agent Discussion

Several BMAD workflows reference "Party Mode" — a multi-agent discussion format where agents with different perspectives debate a topic. The retrospective workflow uses Party Mode for the epic review discussion (Step 6).

Your skill doesn't account for Party Mode. In an OpenClaw context, this would mean spawning multiple sub-agents simultaneously and having them discuss in a shared thread.

**Options:**
- **Skip it:** Party Mode is optional and mostly used in interactive sessions. The retrospective works without it.
- **Implement it:** Spawn 2-3 sub-agents with different personas, collect their perspectives, synthesise. This is advanced but powerful.

**Recommendation:** Skip for v1. Note it as a future enhancement. The retrospective can run as a single-agent reflection with good results.

---

### Q6. Are the default thresholds reasonable?

**Mostly yes. Two adjustments.**

| Threshold | Your Default | Assessment |
|---|---|---|
| `smart_min: 3.0` | Correct | BMAD uses < 3 as the flag threshold |
| `completeness_min: 75` | Correct | BMAD uses < 75% as FAIL |
| `min_findings: 3` | Correct | BMAD mandates "minimum 3-10 issues" |
| `max_cr_iterations: 3` | Correct | Reasonable escalation point |
| `smart_warning: 4.0` | Correct | Below 4 = WARNING in BMAD |
| `completeness_warning: 90` | Correct | Below 90% = WARNING in BMAD |

#### Adjustment 1: Add `holistic_min` threshold

Your config has `holistic_min: 3` but your gate evaluation in `gates.md` uses a hard-coded `holistic < 3` check. Make sure the config value is actually read and used — currently the gate logic appears to reference the threshold directly rather than loading from config.

#### Adjustment 2: Add CR minimum finding validation

Your gates.md mentions `min_findings: 3` in the config but the Pattern D evaluator doesn't validate this. A code review that finds only 1-2 issues should be flagged as INVALID (likely a rubber-stamp review), not treated as a PASS.

**Add to Pattern D evaluation:**

```
IF findings_count < min_findings:
    status = "INVALID"
    action = "re-run code review with stronger adversarial prompt"
    reason = "Rubber stamp detected — fewer than {min_findings} findings"
```

This is explicitly called out in BMAD's code-review instructions: "Find 3-10 specific issues in every review minimum — no lazy 'looks good' reviews."

---

## Additional Findings (Not Asked, But Important)

### Finding 1: Config Template Missing `thinking` Parameter

Your config-template.yaml has model routing but doesn't include the `thinking` parameter that appears in prompt-assembler.md's spawning section (`thinking="high"`). This should be configurable:

```yaml
routing:
  thinking:
    planning: "high"        # PRD, Architecture, Epics — need deep reasoning
    validation: "high"      # Validation workflows — need thorough analysis
    implementation: "medium" # Dev Story — balance speed vs quality
    code_review: "high"     # CR — adversarial needs full reasoning
```

### Finding 2: Skill Doesn't Handle Create-Story's Web Research

Create-Story (CS) Step 4 does web research for latest library versions and best practices. In OpenClaw, the sub-agent needs explicit web access permission. Your prompt-assembler should either:
- Grant web access to CS sub-agents
- Pre-fetch relevant tech documentation and inject it as context
- Skip web research (acceptable, but story quality decreases)

### Finding 3: No Handling for "No Test Framework" Projects

The Dev Story checklist requires 6 testing items (unit, integration, E2E, coverage, regression, quality). Jigsaw 1.6 explicitly has no test framework configured (`ignoreBuildErrors: true`, no test command). Your gates will FAIL every dev-story on testing criteria.

**Options:**
- Add a `testing.enabled: false` config flag that removes testing items from the DoD checklist
- Use the TEA module to set up a test framework first (before implementation phase)
- Accept FAIL on testing items and have the orchestrator downgrade them to warnings

**Recommendation:** Add the config flag for now. Add a note that TEA module setup should happen in Phase 3 (alongside architecture) for projects that want testing.

```yaml
project:
  testing_enabled: false    # Skip testing checklist items in DoD
  testing_framework: null   # Set when TEA module initialises framework
```

### Finding 4: Prompt Assembly Token Budget Missing Story Context Prioritisation

Your prompt-assembler's priority list is: `instructions > story > project-context > referenced artifacts > prior stories > full epics`

For CS (Create Story), the priority should shift: prior stories for the same epic should be HIGH priority (they contain lessons learned that prevent the same mistakes). If context is tight and prior stories get dropped, you lose the "prevention effectiveness" that BMAD's story creation is designed for.

**Recommended priority by workflow:**

```
CS: instructions > epics (target epic) > prior stories > architecture > project-context > UX > PRD
DS: instructions > story file > project-context
CR: instructions > story file > architecture > git diff > File List files > UX > epic > project-context
```

### Finding 5: Missing Sprint Status State Machine Enforcement

Your router handles the story loop but doesn't enforce the sprint-status state machine rules:
- **Never downgrade status** (done → in-progress is illegal)
- **Epic auto-transitions** (backlog → in-progress when first story created)
- **Retrospective status** (optional ↔ done, bidirectional)

If a sub-agent incorrectly writes a downgraded status, the orchestrator should catch and reject it.

---

## Summary Scorecard

| Category | Score | Notes |
|---|---|---|
| Architecture & Modularity | 9/10 | Clean separation, right abstractions |
| CSV Parsing & Sequencing | 9/10 | Correct algorithm, handles phases and sequences |
| Gate Logic | 7/10 | Pattern assignments wrong for VA; missing INVALID detection for CR; IR needs severity awareness |
| Input Loading | 6/10 | CR is significantly under-loaded; CS missing project-context and git intelligence |
| Story Loop | 8/10 | Missing significant discovery gate between epics; missing prep sprint concept |
| Correct Course | 5/10 | Treats all CC outcomes as rewinds; missing Minor/Moderate scope handling |
| Metrics & Learning | 9/10 | Comprehensive, well-designed, BMAD-specific metrics captured |
| Config Template | 8/10 | Good defaults; missing testing flag, thinking parameter, web access config |
| Prompt Assembly | 7/10 | Doesn't account for micro-file workflows; priority ordering needs per-workflow tuning |
| Pipeline State | 7/10 | Dual state risk (pipeline-state.yaml vs sprint-status.yaml); missing state machine enforcement |

**Overall: 7.5/10 — Solid for a v1. The 3 blocking issues (CR input loading, VA gate pattern, CC scope handling) should be fixed before first real use.**

---

## Priority Fix Order

1. **CR input loading** — Will cause missed architectural violations in every code review
2. **CC scope handling** — Will incorrectly rewind the pipeline on Minor/Moderate changes
3. **VA gate pattern** — Will evaluate architecture validation with wrong criteria
4. **Significant discovery gate** — Will skip critical pause points between epics
5. **Sprint-status as source of truth** — Will cause story re-execution on state drift
6. **CR rubber-stamp detection** — Will let lazy reviews pass
7. **Testing config flag** — Will fail every Jigsaw story on testing (since no framework)
8. **Micro-file handling** — Will under-load planning workflow instructions
9. **Per-workflow input priorities** — Quality improvement, not a blocker
10. **State machine enforcement** — Safety improvement, not a blocker
