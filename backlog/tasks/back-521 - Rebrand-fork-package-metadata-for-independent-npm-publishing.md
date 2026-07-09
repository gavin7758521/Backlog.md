---
id: BACK-521
title: Rebrand fork package metadata for independent npm publishing
status: Done
assignee:
  - '@codex'
created_date: '2026-07-09 01:50'
updated_date: '2026-07-09 01:59'
labels:
  - release
  - npm
  - docs
dependencies: []
modified_files:
  - package.json
  - bun.lock
  - bun.nix
  - flake.nix
  - README.md
  - LICENSE
  - .github/workflows/release.yml
  - scripts/resolveBinary.cjs
  - scripts/cli.cjs
  - scripts/postuninstall.cjs
  - src/test/resolveBinary.test.ts
  - src/test/cli-root-entry.test.ts
  - src/test/web-side-navigation-docs-tree.test.tsx
  - src/cli.ts
  - src/core/init.ts
  - src/ui/root-entry.ts
  - src/readme.ts
  - src/guidelines/mcp/init-required.md
  - src/web/components/Navigation.tsx
priority: medium
ordinal: 116000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Prepare this fork to publish under the maintainer's own GitHub and npm identity instead of the upstream Backlog.md package identity. Keep MIT attribution intact while updating package metadata, README install guidance, and release workflow package names.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 package.json uses the maintainer-owned package identity, repository, bugs, homepage, author/contributors, and matching scoped platform optionalDependencies
- [x] #2 README and agent-facing docs no longer point users to upstream npm/GitHub identifiers for this fork's install and repository guidance
- [x] #3 GitHub release workflow publishes and verifies the maintainer-owned main package and platform packages
- [x] #4 MIT license attribution keeps the upstream copyright notice and adds the fork maintainer copyright
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Rename the npm package identity to @gavin7758521/backlog.md and update package metadata to this GitHub repository.\n2. Rename platform optional dependency package names to the same @gavin7758521 scope and update resolver/postuninstall scripts plus tests.\n3. Update README, agent-facing docs, and release workflow install/publish verification text to the scoped package and repository.\n4. Preserve MIT attribution by keeping the upstream copyright and adding the fork maintainer copyright.\n5. Run focused resolver tests plus packaging/format checks as appropriate.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Updated fork publishing identity to @gavin7758521/backlog.md, including scoped platform packages, release workflow publish/install checks, package lock metadata, README/install guidance, runtime docs links, and MIT fork attribution. Validation passed: bun test src/test/resolveBinary.test.ts src/test/cli-root-entry.test.ts src/test/web-side-navigation-docs-tree.test.tsx; bunx tsc --noEmit; bun run check .; npm pack --dry-run --json. bun run update-nix could not run because the script reported Docker/Nix tooling unavailable, so bun.nix was minimally synchronized with the regenerated bun.lock by removing obsolete upstream platform package entries.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rebranded the fork for independent npm publishing under @gavin7758521/backlog.md, kept upstream MIT attribution, and verified package contents plus focused tests, typecheck, and Biome.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 bunx tsc --noEmit passes when TypeScript touched
- [x] #2 bun run check . passes when formatting/linting touched
- [x] #3 bun test (or scoped test) passes
<!-- DOD:END -->
