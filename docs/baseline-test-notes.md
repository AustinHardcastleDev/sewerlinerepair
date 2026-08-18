# Baseline test notes (Task 1)

Date: 2026-08-12

`npm test` after empty-data bootstrap:

- 2 failed suites: `lib/directory-tags.test.ts`, `lib/metro-editorial.test.ts`
- Cause: template still imports `./data/contractors.json` (excluded from copy)
- 3 suites / 8 tests passed
- Expected until Tasks 7–10 rename contractors → contractors and restore data

