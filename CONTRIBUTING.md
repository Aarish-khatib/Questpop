# Contributing to QuestPop

Thanks for your interest in improving QuestPop. This is a small, browser-local productivity project; focused, reviewable changes are especially welcome.

## Before changing code

1. Read the [README](README.md), especially the browser-storage and backup limitations.
2. Open an issue describing the problem or proposed improvement before starting a large change.
3. Keep pull requests narrowly scoped and explain the user-visible behavior they change.

## Local setup

Use a current Node.js release with npm.

```bash
npm install
npm run dev
```

## Verification

Before opening a pull request, run:

```bash
npm test
npm run build
```

The test script runs the Node test files under `tests/`; the build script creates a Vite production bundle. Passing these checks does not replace manual browser testing.

For UI changes, check a narrow/mobile viewport and a desktop viewport. For storage or history changes, check fresh browser storage, existing saved quests, and the export/restore workflow. Never include real personal goal data in test fixtures or screenshots.

## Pull request checklist

- [ ] The change has a clear purpose and an issue reference when applicable.
- [ ] Tests cover changed logic, or the PR explains why automated coverage is not practical.
- [ ] `npm test` and `npm run build` pass locally (or failures are explained).
- [ ] Documentation is updated for changed behavior.
- [ ] No API keys, credentials, private data, or generated dependency folders are committed.

## Security and privacy

QuestPop stores goal information in browser local storage; exported JSON files may contain personal text. Use synthetic examples when reporting bugs. If you discover a potential security issue, avoid posting exploit details or sensitive information in a public issue; contact the maintainer privately through an available GitHub channel first.

Please be respectful and constructive in issues and pull requests.
