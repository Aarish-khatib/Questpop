# QuestPop

**Big goals, smaller quests.**

QuestPop is a productivity web app that breaks overwhelming goals into small, actionable quests. It combines energy-level selection, a focus timer, progress tracking, and a playful comic-inspired interface.

## Features

- Turn goals into manageable quests
- Choose your energy level
- Focus with a built-in timer
- Track progress, quest history, and statistics
- Export completed quest history to a JSON file and restore it on another browser
- Responsive interface
- No sign-up required

## Tech stack

React, Vite, JavaScript, CSS, and browser localStorage.

## Run locally

You need Node.js and npm installed.

```bash
git clone https://github.com/Aarish-khatib/Questpop.git
cd Questpop
npm install
npm run dev
```

Open the URL printed by the development server.

## Production build

```bash
npm run build
```

## Data and backups

Quest progress is stored locally in your browser. Clearing site data or changing devices may remove saved progress.

To back up completed quests, open **History → Export backup**. Save the resulting JSON file somewhere you control. To recover, open **History → Restore backup**, choose the file, and confirm the replacement. Restoring replaces *completed quest history* but leaves any active quest unchanged. Backups are downloaded and read locally; no cloud upload or sign-in is involved.

QuestPop accepts only versioned, validated JSON backups up to 1 MB and stores up to 50 completed quests. Backups may contain personal goal text, so keep them private. Browser storage can still be unavailable or cleared by browser settings.

## Verification

```bash
npm test
npm run build
```

The native Node test suite covers quest planning and backup parsing. GitHub Actions runs tests and builds on pushes and pull requests. Browser interactions should still be checked manually on supported devices.

## Why QuestPop?

Starting a big goal can be harder than making progress. QuestPop explores how smaller steps and lightweight tracking can make it easier to begin.

---

Created by [Aarish](https://github.com/Aarish-khatib).
