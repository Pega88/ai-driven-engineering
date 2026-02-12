# AI-Driven Engineering Workflow

**Standardize and automate your engineering process with Gemini CLI.**

This repository houses the **Workflow Extension** for Gemini CLI—a powerful set of autonomous tools designed to guide you through the entire software development lifecycle, from ambiguous idea to merged Pull Request.

It integrates seamlessly with **Linear** (for project management) and **GitHub** (for version control) to keep your focus on shipping value, not managing tickets.

---

## 🎯 Motivation

**"The entire purpose of this structured workflow is to do the hard clarification and planning work upfront."**

This isn't for quick, one-line fixes. This workflow is designed for shipping **significant new features** or handling **complex migrations** in large, existing codebases—work that involves multiple files, new logic, and proper engineering effort.

**Why?**
By investing time in the first two steps (Define & Plan), we enable our AI agents to run **autonomously for hours** with minimal supervision.

We break the workflow into distinct phases: **Issue**, **Task**, and **Implement**. This structure provides the context and boundaries the agent needs to execute complex work without constantly asking, "What next?"

---

## 🌳 The Secret Weapon: Git Worktrees

**"You can't have agents working in the same folder; they would just overwrite each other's work."**

To enable true parallel autonomy, we leverage **Git Worktrees**. This feature allows you to check out multiple branches from a single repository into separate directories.

Imagine one repository, but with 10, 15, or 20 different features and bugs, each living in its own clean, isolated folder.

- **Agent A** works on `feature-1` in `worktrees/feature-1`.
- **Agent B** fixes `bug-2` in `worktrees/bug-2`.

They run in parallel, on the same codebase, completely isolated. **No conflicts. No stash hell.** You can test each agent's work in its own dedicated folder.

This workflow is optimized for tools like [`wt` (by John Lindquist)](https://www.npmjs.com/package/wt) for managing worktrees, but standard `git worktree` commands work perfectly too.

The `/implement` command [linked here](workflow-extension/commands/implement.toml) is designed to handle this isolation automatically.

---

## 🚀 The Workflow

We follow a strict **Define → Plan → Build → Ship** cycle. This extension provides a specialized AI agent command for each stage.

```mermaid
graph LR
    A[Start] --> B(/issue);
    B --> C(/tasks);
    C --> D(/implement);
    D --> E(/finalize);
    E --> F[Merged];
```

| Stage | Command | Description |
| :--- | :--- | :--- |
| **1. Define** | `/issue` | Turns a rough idea into a comprehensive **Product Requirements Document (PRD)** or Bug Brief directly in Linear. |
| **2. Plan** | `/tasks` | Analyzes the PRD and generates a detailed **Implementation Plan** with parent tasks and atomic sub-tasks. |
| **3. Build** | `/implement` | **The Builder Agent.** Autonomously writes code, runs tests, and commits changes for every task in the plan (using Git Worktrees). |
| **4. Ship** | `/finalize` | Polishes the worktree, resolves conflicts, and opens/updates the **GitHub Pull Request**. |

---

## 📖 Command Reference

### 1. `/issue` (Define)
**"The agent is the PM for five minutes."**

It all starts here. The biggest risk isn't writing the wrong code—it's building the wrong thing. We don't start with code; we start with clarity.

1.  **Pull Context**: The agent grabs the Linear issue through the MCP, ingesting any title, notes, or prior context.
2.  **Clarifying Loop**: It drives a targeted question-and-answer session to help you think through the entire feature (Goal, User Stories, Edge Cases).
3.  **Draft PRD**: With those answers, the agent writes a clean **Product Requirements Document (PRD)** (Intro, Goals, User Stories, Functional Requirements, Metrics) and inserts it as a `## PDR` section in the Linear ticket.

*We are not coding yet. This is just refining what we actually need.*

### 2. `/tasks` (Plan)
**"Bridge the gap from product to engineering."**

Now that we know *what* we're building, we figure out *how*. The agent takes the PRD and converts it into a comprehensive **Implementation Plan**.

1.  **Analyze & Draft**: It reads the PRD and creates high-level parent tasks.
2.  **Detail Sub-tasks**: It drills down into each parent task, breaking them into atomic, step-by-step checklists.
3.  **Map Relevant Files**: It mines the repository to identify exactly which files need to be created or modified, listing them in a `### Relevant Files` section.
4.  **Sync & Validate**: The entire plan is written into a `## PLAN` section in Linear.

*This is our roadmap. We (the engineers) review and validate this plan before a single line of code is written.*

### 3. `/implement` (Build)
**"Where the magic happens."**

This step runs as a fully autonomous loop. The agent becomes your pair programmer.

1.  **Pull Approved Plan**: It reads the engineer-approved `## PLAN` from Linear as the single source of truth.
2.  **Execute**: It grabs the first unchecked sub-task, writes the code, and runs the tests.
3.  **Sync**: After each step, it checks off the sub-task in Linear `[x]` and adds a progress comment.
4.  **Repeat**: It immediately grabs the next sub-task and continues.

*It runs continuously until the plan is complete or it gets blocked, at which point it pauses to notify you.*

### 4. `/finalize` (Ship)
**"The finishing touch."**

Once implementation is complete, we prepare for delivery. This command ensures your work is clean, consistent, and ready for review.

1.  **Clean Up**: Checks for any unstaged changes or leftover artifacts in the worktree.
2.  **Update**: Fetches the latest `development` branch and rebases or merges to ensure your feature is up-to-date.
3.  **Resolve**: Attempts to auto-resolve merge conflicts (asking for guidance if they are complex).
4.  **PR**: Opens or updates a GitHub Pull Request with a concise summary and link to the Linear issue.

---

## 📦 Installation

You can install this extension directly into your Gemini CLI.

### From GitHub (Recommended)
```bash
gemini extensions install https://github.com/your-username/AI-Driven-Engineering
```

### Local Development
If you have cloned this repository locally:
```bash
cd AI-Driven-Engineering
gemini extensions link ./workflow-extension
```

---

## 🛠 Prerequisites

To use this workflow effectively, ensure you have the following configured in your Gemini CLI or environment:

1.  **Gemini CLI** (Latest version)
2.  **Linear MCP** (Configured with your API key)
3.  **GitHub CLI** (`gh` tool installed and authenticated)
4.  **Git** (Initialized repository)

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing patterns defined in `workflow-extension/commands/*.toml` and ensure any changes to the workflow logic are reflected in `workflow-extension/GEMINI.md`.

1.  Fork the repo.
2.  Create a feature branch.
3.  Submit a PR (ironically, you can use the workflow to build the workflow).
