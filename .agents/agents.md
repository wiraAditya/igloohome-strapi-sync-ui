# AI Agent Configuration & Guidelines

This document outlines the specialized agent types, their roles, and the quality standards for AI-driven engineering within the Skuling Admin FE project.

## Core Principles

1.  **Logic Preservation**: Application logic is strictly read-only for UI agents.
2.  **Specialization**: Always use the most specific agent available for a task.
3.  **Mandatory Review**: Every code implementation must be reviewed by a specialized reviewer agent.
4.  **Skill Initialization**: Always invoke "load your skills" at the start of every task.

---

## Agent Definitions

### `nuxt-code-expert`
*   **Role**: Expert-level Nuxt 4, Vue 3, and TypeScript implementation.
*   **Focus**: Component architecture, composable design, and complex state management.
*   **Standards**: Enforces "Tiger-style" coding (strict types, modularity, performance).

### `frontend-design`
*   **Role**: Production-grade UI/UX redesign and styling.
*   **Focus**: Tailwind v4, professional SaaS aesthetics, responsiveness, and accessibility.
*   **Constraint**: Forbidden from modifying business logic or API communication.

### `code-security-reviewer`
*   **Role**: Senior code auditor for security and standards.
*   **Focus**: Vulnerability assessment, memory safety, and adherence to enterprise coding patterns.

---

## Technical Standards (Tiger-Style)

### Component Guidelines
- Use `<script setup lang="ts">`.
- Standardize props using `defineProps` and models using `defineModel`.
- Prefer composition API over options API.
- Use `lucide-vue-next` for iconography via the `:icon` prop.

### UI & Styling
- **Tailwind v4**: Use `@theme` tokens and `@reference` for component style blocks.
- **Base Components**: Exclusively use `SkCard`, `SkButton`, `SkInfoPill`, and `SkBackButton`.
- **Responsive Design**: All data views must support desktop (tables/grids) and mobile (cards).

### Documentation
- Every significant change must be accompanied by an update to the project logs or relevant README sections.
- UI modifications should be clearly documented for logic safety.

---

## Workflow Protocol

1.  **Orchestrator Plan**: The primary agent breaks down the user request.
2.  **Specialized Delegation**: Tasks are sent to specialized subagents.
3.  **Review Gate**: Reviewer agents validate the output.
4.  **Final Integration**: The orchestrator verifies the end state and documents.
