# Cline Rules Enforcement

These rules are mandatory defaults for this workspace.

## Always-on behavior

- Always report to users that you read and will follow the clinerules before starting any new task.
- Treat all files in `.clinerules/` as active instructions for every request in this workspace.
- Do not wait for the user to remind you to read or follow `.clinerules/*`.
- Before coding, editing files, or running commands, align your plan with `.clinerules/*`.

## Conflict handling

- If a user request conflicts with `.clinerules/*`, call out the conflict clearly.
- Ask for clarification before proceeding when instructions are ambiguous.
- Prefer the safest, smallest change that satisfies the request and the rules.

## Response quality gates

- Keep changes surgical and avoid unrelated refactors.
- Reuse existing patterns before introducing new abstractions.
- Never claim verification you did not run.
- Always report: what you found, what you changed, assumptions/risks, and how to verify.

## Rule update behavior

- After `.clinerules/*` changes, assume a fresh session/reload is required for guaranteed pickup.