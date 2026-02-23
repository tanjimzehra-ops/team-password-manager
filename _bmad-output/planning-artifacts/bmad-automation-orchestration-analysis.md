# BMAD v6 Automation & Orchestration Guide

**Date:** 2026-02-23
**Author:** Nicolás Pinto Tironi
**Context:** Claudia (Claude Opus) runs on OpenClaw as a personal orchestrator with access to BMAD v6. Cortexia MVP (36 stories, 8 epics) was built using BMAD but without full agent separation or implementation artifacts. This guide establishes the automation strategy for proper BMAD compliance going forward, starting with Jigsaw 1.6.

---

## Table of Contents

1. [Is the Documentation Trail Valuable for Solo + AI?](#1-is-the-documentation-trail-valuable-for-solo--ai)
2. [Automating the Full Pipeline](#2-automating-the-full-pipeline)
3. [Ideal Orchestration Pattern](#3-ideal-orchestration-pattern)
4. [Model Tier Allocation](#4-model-tier-allocation)
5. [Minimum Viable BMAD Compliance](#5-minimum-viable-bmad-compliance)
6. [Retroactive Compliance for Existing Projects](#6-retroactive-compliance-for-existing-projects)
7. [How the Orchestrator Interacts with Workflows](#7-how-the-orchestrator-interacts-with-workflows)
8. [Where Code Execution Happens](#8-where-code-execution-happens)
9. [bmad-help.csv Column Reference](#9-bmad-helpcsv-column-reference)
10. [Story Loop Orchestration (CS → VS → DS → CR)](#10-story-loop-orchestration-cs--vs--ds--cr)
11. [Handoff Format Between Workflows](#11-handoff-format-between-workflows)
12. [Context Limit Handling for Large Stories](#12-context-limit-handling-for-large-stories)
13. [Next Steps for Jigsaw 1.6](#13-next-steps-for-jigsaw-16)

---

## Part I — Strategic Decisions

### 1. Is the Documentation Trail Valuable for Solo + AI?

**Yes — but the value shifts compared to teams.**

The BMAD documentation trail serves three purposes that remain valuable even for a solo developer with AI assistance:

- **Context preservation** — LLMs lose context between sessions. Sprint status files, story files, and validation reports are the "memory" that lets any agent pick up where another left off. Without them, the process relies on ad-hoc handoff documents.
- **Quality gates catch drift** — When a single entity handles both planning and implementation, confirmation bias creeps in. The separate validation workflows (Validate PRD, Validate Architecture, Check Implementation Readiness) are designed to catch gaps that the creator wouldn't notice.
- **Reproducibility** — A working app is good. But can the process be handed to another developer or AI agent and produce a similar result? The artifacts ARE the process.

**Bottom line:** Full BMAD compliance on every micro-task is overkill. But the sprint-planning → create-story → dev-story → code-review cycle is where most of the value lives for implementation quality. That's the part that was skipped on Cortexia.

---

### 2. Automating the Full Pipeline

#### Agent-to-Model Mapping

| BMAD Agent | Role | Model Recommendation |
|---|---|---|
| Mary (Analyst) | Research, briefs, brainstorming | High-capability (Opus/k2.5) — needs synthesis |
| John (PM) | PRD, epics & stories | High-capability — needs judgment calls |
| Sally (UX Designer) | UX design, wireframes, diagrams | High-capability — needs design reasoning |
| Winston (Architect) | Architecture, readiness checks | High-capability — needs system thinking |
| Bob (Scrum Master) | Sprint planning, story prep, retros | Medium — mostly structural/organisational |
| Amelia (Developer) | Dev-story, code-review | See [Section 4](#4-model-tier-allocation) |
| Murat (TEA) | Test framework, test design | Medium-to-high depending on complexity |

#### Automation Architecture

```
Claudia (Orchestrator / Opus)
  ├── Reads bmad-help.csv for workflow sequence
  ├── Checks phase gates (required=true blocks progress)
  ├── Spawns sub-agent per workflow with:
  │   ├── Agent persona (from agent file)
  │   ├── Workflow instructions (from workflow file)
  │   └── Input artifacts (from previous phase outputs)
  ├── Collects output artifacts
  ├── Validates gate completion
  └── Routes to next workflow or escalates to human
```

Each workflow file (`_bmad/bmm/workflows/*/workflow.md|yaml`) is self-contained. It tells the agent exactly what to do, what inputs it needs, and what outputs to produce. Claudia doesn't need to understand BMAD deeply — she needs to:

1. Read the CSV for sequence
2. Load the right workflow + agent for each step
3. Feed outputs from step N as inputs to step N+1
4. Enforce `required=true` gates

---

### 3. Ideal Orchestration Pattern

**Hybrid (Option C) is what BMAD is designed for.**

| Option | Approach | Verdict |
|---|---|---|
| A — Script-driven | Fully automated sequence | Breaks at validation workflows — judgment can't be binary |
| B — Human-in-the-loop | Human routes every step | Defeats the purpose of AI agents; human becomes the bottleneck |
| **C — Hybrid** | **Orchestrator manages pipeline, validates gates, escalates decisions** | **Matches BMAD philosophy** |

#### Practical Pattern

```
PLANNING PHASES (1-3): Human reviews each required gate
  - Claudia orchestrates, spawns agents
  - Human approves: PRD, Architecture, Epics, Readiness Check

IMPLEMENTATION PHASE (4): Human reviews per-epic, not per-story
  - Sprint Planning → human approves sprint scope
  - Story cycle (CS → VS → DS → CR) runs autonomously
  - Code Review is the quality gate — flag failures to human
  - Retrospective at epic end → human reviews
```

The story cycle is a self-contained loop: Create Story → Validate Story → Dev Story → Code Review → back to Dev Story if fixes needed, or next Create Story, or Retrospective if epic complete. This loop can run without human intervention until it hits a problem.

---

### 4. Model Tier Allocation

| Workflow | Model Tier | Rationale |
|---|---|---|
| Sprint Planning | High | Scope decisions matter |
| Create Story | Medium | Structural task |
| Validate Story | Medium | Checklist-based |
| Dev Story | Medium-High | Depends on code complexity |
| Code Review | **High** | Judgment-intensive, last quality gate |
| Retrospective | Medium | Reflective/structural |

- **Dev Story** — The workflow provides structured instructions. A capable coding model (Kimi k2.5, GLM 5) can follow the story file's acceptance criteria. The story file IS the prompt. This is where cheaper models shine because the task is well-scoped.
- **Code Review** — Requires understanding architectural decisions, spotting subtle bugs, and knowing when to reject vs approve. Use a high-capability model, or have the orchestrator (Opus) do a second-pass review on CR results.

**Benchmarking tip:** Run the same story through two models and compare. The story file provides a fixed input, making results directly comparable.

---

### 5. Minimum Viable BMAD Compliance

Based on `required=true` in the BMAD workflow catalogue:

#### Planning — Never Skip (Cheap and High-Leverage)

| # | Workflow | Phase | Gate |
|---|---|---|---|
| 1 | **Create PRD** | 2-planning | Foundation everything builds on |
| 2 | **Create Architecture** | 3-solutioning | Technical decisions |
| 3 | **Create Epics & Stories** | 3-solutioning | Work breakdown |
| 4 | **Check Implementation Readiness** | 3-solutioning | Alignment gate before coding |

#### Implementation — Per-Story Minimum

| # | Workflow | Frequency | Gate |
|---|---|---|---|
| 5 | **Sprint Planning** | Once per sprint | Scope agreement |
| 6 | **Create Story** | Per story | Story file with acceptance criteria |
| 7 | **Dev Story** | Per story | The actual implementation |

#### Optional but High-Value

| Workflow | When to Include |
|---|---|
| Validate PRD / Architecture / Epics | Always for complex projects, skip for simple ones |
| Validate Story | Skip if story is simple and well-defined |
| **Code Review** | **Highest-value optional workflow — the safety net** |
| Retrospective | Skip for small epics, valuable for complex ones |
| UX Design | Skip if no UI component |

**TL;DR minimum path:** PRD → Architecture → Epics → Readiness → Sprint Plan → (Create Story → Dev Story) per story. Add Code Review for quality assurance.

---

### 6. Retroactive Compliance for Existing Projects

**Recommendation: Do not retroactively generate artifacts. Apply full compliance going forward.**

Reasons:

- Retroactive documentation is archaeology, not engineering. Writing artifacts to describe decisions already made doesn't guide those decisions.
- The value of BMAD artifacts is in the **process** (forcing structured thinking), not the **documents** themselves.
- Time spent retro-documenting is time not spent doing new work properly.

**One exception:** For projects with a significant Phase 2 of development, generate a **project-context.md** using the Generate Project Context workflow (`/bmad-bmm-generate-project-context`). This captures the current codebase state for future AI agents and takes minutes to produce.

---

## Part II — Implementation Details

### 7. How the Orchestrator Interacts with Workflows

The BMAD execution model has three layers:

#### Layer 1 — Agent Persona

Files like `_bmad/bmm/agents/dev.md` contain personality traits, principles, communication style, and menu items with handler attributes (`workflow=`, `exec=`, `data=`). The agent file is the entry point that a human would normally load.

#### Layer 2 — Core Workflow Engine

Located at `_bmad/core/tasks/workflow.xml`. When a menu handler has `workflow="path/to/workflow.yaml"`, the agent loads this universal execution engine. It reads the YAML, resolves all variables against `config.yaml`, discovers inputs via glob patterns, and steps through `instructions.xml` in strict numerical order.

#### Layer 3 — Workflow Config (the YAML)

Defines: config source, input file patterns with load strategies, output paths, and points to its own `instructions.xml` + `checklist.md`.

#### Concrete Pattern for Claudia

```
1. Read the workflow YAML
2. Resolve variables:
   - {project-root}        → repository root
   - {config_source}:field  → read config.yaml, extract field value
   - {planning_artifacts}   → _bmad-output/planning-artifacts
   - {implementation_artifacts} → _bmad-output/implementation-artifacts
3. Load input files using input_file_patterns:
   - FULL_LOAD:       glob and load everything matching the pattern
   - SELECTIVE_LOAD:  load specific file by template variable (e.g., epic number)
   - INDEX_GUIDED:    load index.md first, then selectively load relevant sections
4. Load instructions.xml (the step-by-step procedure)
5. Assemble and pass to sub-agent as a single prompt:
   - Agent persona (personality, principles, communication style)
   - Resolved workflow instructions (all steps)
   - Input artifact CONTENT (not just paths — the agent needs the text)
   - Output path for where to write results
```

**Key insight:** The sub-agent doesn't need to read `workflow.xml` itself. Claudia pre-processes all of that and delivers a self-contained prompt. The sub-agent receives a fully resolved, ready-to-execute instruction set.

#### Load Strategy Reference

| Strategy | Behaviour | When Used |
|---|---|---|
| `FULL_LOAD` | Glob pattern, load ALL matching files | PRD, Architecture, UX — needed in their entirety |
| `SELECTIVE_LOAD` | Load one specific file using a template variable | Epic files when processing a specific story |
| `INDEX_GUIDED` | Load `index.md`, parse structure, load only relevant sections | Sharded documents (large epics, large architecture docs) |

---

### 8. Where Code Execution Happens

The dev-story workflow is **not IDE-specific**. Based on `instructions.xml`, it needs:

- **File read/write** — story file updates, new source files
- **Shell execution** — run tests, git operations
- **File tree awareness** — to update the File List section in the story

**`exec` + `git` is sufficient.** The workflow does not use IDE features like inline edits, visual diffs, or file tree GUIs. It works through:

1. Reading the story file for tasks and acceptance criteria
2. Creating/modifying source files
3. Running tests (`pnpm test`, `pnpm build`, etc.)
4. Updating checkbox marks `[x]` in the story file
5. Writing to the Dev Agent Record section

The code-review workflow similarly needs file read + `git diff` access. It reads every file in the story's File List and cross-references against the git diff.

**One caveat:** The dev agent is instructed to "NEVER stop because of milestones or session boundaries" — meaning it expects to run to completion in a single session. For large stories in OpenClaw, ensure sufficient context window or apply the chunking strategy from [Section 12](#12-context-limit-handling-for-large-stories).

---

### 9. bmad-help.csv Column Reference

This is the workflow manifest that drives orchestration. Here is each column and how an orchestrator should use it:

| Column | Purpose | Orchestrator Use |
|---|---|---|
| `module` | Which BMAD module (`bmm`, `bmb`, `cis`, `tea`, `core`) | Filter to active module |
| `phase` | Phase name (`1-analysis`, `2-planning`, `3-solutioning`, `4-implementation`, `anytime`) | **Sequence ordering** — phases run in number order |
| `name` | Human-readable workflow name | Display and logging |
| `code` | Short code (`BP`, `CP`, `DS`, `CR`...) | Quick reference |
| `sequence` | Numeric sort order within phase | **Sort by this within each phase** |
| `workflow-file` | Path to the workflow YAML/MD | **What to load and execute** |
| `command` | Slash command name (e.g., `bmad-bmm-create-prd`) | How humans invoke it; orchestrator can use for logging |
| `required` | `true` or `false` | **CRITICAL: `true` = must complete before advancing to next phase** |
| `agent-name` | Internal agent identifier | Used to locate and load the agent file |
| `agent-command` | Agent loading command with persona hint | Contains agent file path (parse after `agent:`) |
| `agent-display-name` | Friendly name (Mary, John, Winston...) | Display |
| `agent-title` | Role title with emoji | Display |
| `options` | Mode string (`Create Mode`, `Validate Mode`, etc.) | Passed to workflow as execution mode selector |
| `description` | What the workflow does | Context for orchestrator routing decisions |
| `output-location` | Config variable name for output path | Resolve against `config.yaml` to get actual directory |
| `outputs` | Artifact type produced (e.g., `prd`, `story`, `sprint status`) | **Completion detection** — glob for these in the resolved output-location |

#### Orchestrator Parsing Algorithm

```python
import csv

def load_pipeline(csv_path, module="bmm"):
    """Load and sequence the BMAD pipeline for a given module."""
    with open(csv_path) as f:
        workflows = list(csv.DictReader(f))

    # Filter to target module + universal (empty module)
    active = [w for w in workflows if w["module"] in (module, "")]

    # Separate anytime tools from phased workflows
    anytime = [w for w in active if w["phase"] == "anytime"]
    phased = [w for w in active if w["phase"] != "anytime"]

    # Sort by phase name (lexicographic works: 1-xxx < 2-xxx < 3-xxx < 4-xxx)
    # then by sequence number within phase
    phased.sort(key=lambda w: (w["phase"], int(w["sequence"])))

    return phased, anytime


def find_next_workflow(phased, output_base):
    """Find the next workflow to execute based on artifact existence."""
    for wf in phased:
        output_dir = resolve_output_location(wf["output-location"])
        artifact_type = wf["outputs"]

        if artifact_type and artifact_exists(output_dir, artifact_type):
            continue  # Already completed

        if wf["required"] == "true":
            return wf, "REQUIRED — must complete before proceeding"

        # Optional workflow — orchestrator or human decides
        return wf, "OPTIONAL — can skip"

    return None, "ALL COMPLETE"


def resolve_output_location(var_name):
    """Map config variable names to actual paths."""
    config_map = {
        "planning_artifacts": "_bmad-output/planning-artifacts",
        "implementation_artifacts": "_bmad-output/implementation-artifacts",
        "output_folder": "_bmad-output",
        "project_knowledge": "docs",
    }
    return config_map.get(var_name, var_name)
```

---

### 10. Story Loop Orchestration (CS → VS → DS → CR)

Based on the actual workflow files, the recommended pattern is **one session per workflow step, not per story**.

#### Why Separate Sessions

| Step | Agent | Context Needs | Rationale |
|---|---|---|---|
| **Create Story (CS)** | Bob (SM) | Epics + Architecture + UX + previous stories + git history + web research | Needs broad context; produces the story `.md` file |
| **Validate Story (VS)** | Bob (SM) | Story file + checklist | Lightweight; can run in same session as CS or separately |
| **Dev Story (DS)** | Amelia (Dev) | Story file + `project-context.md` only | Focused implementation session; runs to completion |
| **Code Review (CR)** | Amelia (adversarial) | Story file + git diff + every file in File List | **Must be a separate session from DS** — reviewer ≠ implementer |

#### CR → DS Fix Loop

When code review finds issues:

1. CR updates the story file with findings (severity ratings, specific issues)
2. A **new DS session** picks up the story (now with CR findings as additional context)
3. Dev fixes issues, updates task checkboxes
4. A **new CR session** re-reviews

Fresh sessions for each iteration. The story file is the persistent state that carries context between sessions.

#### Full Orchestrator Flow

```python
def execute_story_loop(story_key, max_cr_iterations=3):
    """Execute the full story cycle for one story."""

    # Step 1: Create Story
    run_workflow("create-story", agent="sm", input={
        "sprint_status": load("implementation-artifacts/sprint-status.yaml"),
        "epics": load_all("planning-artifacts/*epic*"),
        "architecture": load("planning-artifacts/*architecture*"),
        "ux": load("planning-artifacts/*ux*"),
    })
    # Output: implementation-artifacts/{story_key}.md (status: ready-for-dev)

    # Step 2: Validate Story
    run_workflow("create-story", mode="validate", agent="sm", input={
        "story_file": load(f"implementation-artifacts/{story_key}.md"),
    })
    # If validation fails → loop back to Step 1

    # Step 3: Dev Story
    run_workflow("dev-story", agent="dev", input={
        "story_file": load(f"implementation-artifacts/{story_key}.md"),
        "project_context": load("**/project-context.md"),
    })
    # Output: code changes + story file updated (tasks checked, File List populated)

    # Step 4: Code Review (with retry loop)
    for i in range(max_cr_iterations):
        review = run_workflow("code-review", agent="dev-adversarial", input={
            "story_file": load(f"implementation-artifacts/{story_key}.md"),
            "git_diff": shell("git diff main...HEAD"),
        })

        if review.approved:
            update_sprint_status(story_key, "done")
            break
        else:
            # Fixes needed — new dev session with review findings
            run_workflow("dev-story", agent="dev", input={
                "story_file": load(f"implementation-artifacts/{story_key}.md"),
                "review_findings": review.findings,
                "project_context": load("**/project-context.md"),
            })

    # Step 5: Check if epic is complete
    if all_stories_done(epic_of(story_key)):
        # Optional: run retrospective
        run_workflow("retrospective", agent="sm")
```

#### Sprint-Level Orchestration

```python
def execute_sprint():
    """Execute all stories in the current sprint."""

    # Load sprint status
    status = load("implementation-artifacts/sprint-status.yaml")

    for story in status.stories_by_priority():
        if story.status in ("backlog", "ready-for-dev"):
            execute_story_loop(story.key)

        # After each story, check for human escalation triggers
        if needs_human_review(story):
            notify_human(f"Story {story.key} needs attention")
            wait_for_human()
```

---

### 11. Handoff Format Between Workflows

**The `sprint-status.yaml` is the routing manifest. Story files are the contracts.** Handoff is file-system based, not message-based.

#### Flow of Artifacts Through the Pipeline

```
Phase 2:  Create PRD ──writes──→ planning-artifacts/prd.md
                                        │
Phase 3:  Create Architecture ──reads───┘──writes──→ planning-artifacts/architecture.md
          Create Epics ──reads PRD + Architecture──→ planning-artifacts/epics.md
          Check Readiness ──reads ALL above──→ planning-artifacts/readiness-report.md
                                        │
Phase 4:  Sprint Planning ──reads epics─┘──writes──→ implementation-artifacts/sprint-status.yaml
          Create Story ──reads sprint-status + epics + arch + ux──→ implementation-artifacts/{story}.md
          Dev Story ──reads story file──→ code changes + updated story file
          Code Review ──reads story file + git diff──→ review findings in story file
```

#### What Each Workflow Expects as Input

| Workflow | Inputs | Discovery Method |
|---|---|---|
| Create PRD | Product brief (if exists) | Glob `{planning_artifacts}/*brief*` |
| Create Architecture | PRD | Glob `{planning_artifacts}/*prd*` |
| Create Epics | PRD + Architecture | Glob with `FULL_LOAD` |
| Sprint Planning | Epic files | Glob `{planning_artifacts}/*epic*` |
| Create Story | Epics + Architecture + UX + sprint-status + previous stories | Multi-pattern discovery |
| Dev Story | Story file + `project-context.md` | Explicit path from sprint-status |
| Code Review | Story file + source files from File List | Story file parsed, then file reads |

#### Critical Rule for OpenClaw

**Pre-load content, don't pass paths.** The sub-agent in OpenClaw may not have the same filesystem mount. Claudia should:

1. Resolve the glob patterns
2. Read the file contents
3. Inject the actual text into the sub-agent prompt
4. Include the target output path so the sub-agent knows where to write

```
# BAD — sub-agent may not have filesystem access
"Please read _bmad-output/planning-artifacts/prd.md and create architecture."

# GOOD — content is pre-loaded
"Here is the PRD content:
---
[full PRD text]
---
Please create the architecture document. Write output to:
_bmad-output/planning-artifacts/architecture.md"
```

---

### 12. Context Limit Handling for Large Stories

BMAD addresses context limits at two levels:

#### Level 1 — Story Granularity (Prevention)

The Create Epics & Stories workflow is designed to produce stories small enough for single-session implementation. The sprint-planning workflow further scopes sprints. If stories are too large, that's a planning failure — use Correct Course (`/bmad-bmm-correct-course`) to re-scope.

#### Level 2 — Document Sharding (Accommodation)

The `input_file_patterns` support sharded documents:

```yaml
epics:
  whole: "{planning_artifacts}/*epic*.md"         # Single file
  sharded: "{planning_artifacts}/*epic*/*.md"      # Split into directory of files
  load_strategy: "INDEX_GUIDED"                    # Load index, then selective
```

There's a dedicated core task for this: `/bmad-shard-doc` — splits documents over 500 lines into sections with an `index.md` for navigation. The `INDEX_GUIDED` load strategy then reads the index and only loads relevant sections.

#### Level 3 — Story File as Resumption State (Recovery)

If a dev-story session hits context limits mid-implementation, the story file provides built-in checkpointing:

| Story File Section | Recovery Purpose |
|---|---|
| Tasks/Subtasks `[x]` checkboxes | Track which tasks are complete vs remaining |
| Dev Agent Record | Log of what was accomplished, model used, debug notes |
| File List | Which files were created/modified so far |
| Status field | `ready-for-dev` → `in-progress` → `review` → `done` |

A new session picks up from unchecked tasks. The File List tells it what already exists. The Dev Agent Record provides context on decisions made.

#### Practical Strategy for OpenClaw

```
1. Keep stories to ≤8 tasks with ≤3 subtasks each (planning discipline)
2. For brownfield projects, generate project-context.md to compress codebase knowledge
3. If a session runs long:
   a. Sub-agent saves progress (checkboxes, File List, Dev Agent Record)
   b. Claudia detects incomplete story (unchecked tasks remain)
   c. Claudia spawns a new session with: story file + project-context.md
   d. New session reads checkboxes and continues from where it left off
4. For very large documents, use /bmad-shard-doc before the workflow that needs them
```

---

## Part III — Quick Reference

### Config Variable Resolution

| Variable | Resolves To |
|---|---|
| `{project-root}` | Repository root (`/Users/nicolaspt/Jigsaw-1.6-RSA`) |
| `{config_source}` | `_bmad/bmm/config.yaml` |
| `{planning_artifacts}` | `_bmad-output/planning-artifacts` |
| `{implementation_artifacts}` | `_bmad-output/implementation-artifacts` |
| `{output_folder}` | `_bmad-output` |
| `{project_knowledge}` | `docs` |
| `{installed_path}` | Path to the specific workflow directory |

### Sprint Status State Machines

```
Epic:    backlog → in-progress → done
Story:   backlog → ready-for-dev → in-progress → review → done
Retro:   optional ↔ done
```

Rules: Never downgrade status. Epic auto-transitions to `in-progress` when first story is created.

### Story File Naming Convention

```
{epic_num}-{story_num}-{kebab-case-title}.md
Example: 1-2-user-authentication.md
```

### Key File Paths

| File | Path |
|---|---|
| Workflow catalogue | `_bmad/_config/bmad-help.csv` |
| BMM config | `_bmad/bmm/config.yaml` |
| Workflow engine | `_bmad/core/tasks/workflow.xml` |
| Dev agent (Amelia) | `_bmad/bmm/agents/dev.md` |
| SM agent (Bob) | `_bmad/bmm/agents/sm.md` |
| PM agent (John) | `_bmad/bmm/agents/pm.md` |
| Architect (Winston) | `_bmad/bmm/agents/architect.md` |
| Analyst (Mary) | `_bmad/bmm/agents/analyst.md` |
| Sprint Planning | `_bmad/bmm/workflows/4-implementation/sprint-planning/workflow.yaml` |
| Create Story | `_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml` |
| Dev Story | `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml` |
| Code Review | `_bmad/bmm/workflows/4-implementation/code-review/workflow.yaml` |

---

## 13. Next Steps for Jigsaw 1.6

Brainstorming session is complete (2026-02-16, 56 ideas). The pipeline continues:

1. **Create Brief** — `/bmad-bmm-create-brief` — Mary (Analyst) — Formalise brainstorming into a product brief
2. **Create PRD** — `/bmad-bmm-create-prd` — John (PM) — **Required first gate**
3. **Create UX** — `/bmad-bmm-create-ux-design` — Sally (UX Designer) — Recommended for UI-heavy project
4. **Create Architecture** — `/bmad-bmm-create-architecture` — Winston (Architect) — **Required**
5. **Create Epics & Stories** — `/bmad-bmm-create-epics-and-stories` — John (PM) — **Required**
6. **Check Implementation Readiness** — `/bmad-bmm-check-implementation-readiness` — Winston (Architect) — **Required**
7. **Sprint Planning** — `/bmad-bmm-sprint-planning` — Bob (Scrum Master) — Kicks off implementation

Run each workflow in a **fresh context window**. For validation workflows, use a different high-quality model than the one that created the artifact — this avoids the creator reviewing their own work.
