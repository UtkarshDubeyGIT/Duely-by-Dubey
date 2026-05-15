---
name: drill-me
description: 'Turn partial context into a complete shared understanding through adaptive, question-driven clarification loops. Use for rough specs, pasted context, product ideas, code-change requests, research plans, prompts, and workflow definitions before implementation.'
argument-hint: 'What do you want to clarify, and what output/decision do you need?'
user-invocable: true
disable-model-invocation: false
---

# Context Clarification

Use this skill to turn partial context into a complete shared understanding.

The output is not the final solution. The output is a question-driven clarification loop and, once context is sufficient, a concise understanding brief.

## When to Use

Use this skill when the user provides incomplete inputs such as:
- rough specs
- partial notes
- pasted code descriptions
- product concepts
- prompt drafts
- implementation asks with missing constraints

Do not use this skill when the user explicitly asks to implement immediately and accepts assumptions.

## Core Behavior

1. Start from what the user already provided.
2. Restate the current understanding in 1 to 3 sentences.
3. Identify the highest-impact unknowns and assumptions.
4. Ask targeted questions in batches, then stop and wait for answers.
5. After each reply, update the model and ask only remaining high-impact questions.
6. Stop once context is sufficient to proceed responsibly, or when the user asks to proceed with assumptions.
7. Produce a hybrid understanding brief (short bullets plus a one-paragraph summary).

## Question Strategy

Only ask questions that materially change the answer.

Cover the most relevant categories for the task:
- Objective: success criteria and the decision/output needed
- Audience: who uses, reviews, maintains, or is impacted
- Current state: known artifacts, constraints, prior decisions, assumptions
- Desired behavior: expected flows, edge cases, non-goals, failure modes
- Constraints: timeline, budget, stack, dependencies, compliance, style/tone
- Tradeoffs: optimization priorities when goals conflict
- Evidence: examples, metrics, references, source material

Avoid generic questionnaires and avoid asking for context already present.

## Batch Rules

- Ask 3 to 7 questions per round.
- Ask fewer when:
  - task is narrow
  - user is busy
  - one blocker dominates
- Ask more only when the user requests a thorough drill-down.
- Use numbered questions.
- Keep each question short and answerable.
- Add a short reason only when it helps prioritization.
- Offer options only when they reduce effort; include an open-ended escape hatch.

## Loop and Branching

### Step A: Build Working Model
- Parse user input and infer draft intent.
- Capture explicit facts separately from assumptions.
- Detect contradictions or missing decision points.

### Step B: Ask Next Batch
- Prioritize unknowns by expected impact on output quality.
- Ask the smallest useful batch (3 to 7).
- Wait for user response before any implementation or recommendation.

### Step C: Update and Narrow
- Integrate new answers into the working model.
- Remove resolved questions.
- Ask only unresolved, high-impact follow-ups.

### Step D: Decide Completion
Complete clarification when one of these is true:
- enough context exists to proceed responsibly
- remaining unknowns are low impact
- user asks to proceed with assumptions

If answers are incomplete, ask only for missing or conflicting points.
Do not re-ask the full list.

## Guardrails

- Do not interrogate endlessly.
- Do not disguise recommendations as questions.
- Ask first; advise later.
- Do not overfit to one domain.
- Keep the process usable for product, code, writing, research, prompts, business, and personal workflows.

## Completion Output

When complete, produce an understanding brief with:
- Goal
- Known context
- Key decisions
- Constraints
- Assumptions
- Open questions (if any)
- Recommended next step

Default to a hybrid format: short bullets plus a one-paragraph summary.
Keep it concise and action-oriented.
Do not archive every detail.

## Quality Checks

Before finishing, verify:
- questions were adaptive to user context
- each question was high-impact
- no duplicate requests for already provided information
- clarification stopped at sufficient confidence
- final brief is concise and operational
