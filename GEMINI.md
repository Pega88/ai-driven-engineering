# Workflow Extension

This extension provides a standardized workflow for AI-Driven Engineering, integrating with Linear and GitHub.

## Commands

### `/workflow:issue`
Starts the workflow by helping you refine a feature request or bug report into a structured PRD (Product Requirement Document) or Bug Brief within a Linear issue.

### `/workflow:tasks`
Generates a detailed implementation plan with tasks and sub-tasks based on the PRD in the Linear issue. It syncs the plan directly to the issue.

### `/workflow:implement`
Autonomously executes the implementation plan. It reads the tasks from Linear, writes code, runs tests, commits changes, and updates the task status in Linear.

### `/workflow:finalize`
Prepares the feature for review. It ensures the worktree is clean, resolves conflicts (if any), creates or updates a GitHub PR, and updates the Linear issue.

## Usage

1.  **Define:** Use `/workflow:issue` to clarify what needs to be built.
2.  **Plan:** Use `/workflow:tasks` to break it down into actionable steps.
3.  **Build:** Use `/workflow:implement` to build it.
4.  **Ship:** Use `/workflow:finalize` to wrap it up.
