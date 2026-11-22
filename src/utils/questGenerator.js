import {
  categoryKeywords,
  energyLevels,
} from "../data/questTemplates.js";

function cleanGoal(goal) {
  return typeof goal === "string" ? goal.trim().replace(/\s+/g, " ") : "";
}

function detectCategory(goal) {
  const text = goal.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    // Require word boundaries so "happy" does not match "app".
    const match = keywords.some((keyword) =>
      new RegExp(`(^|[^a-z0-9])${keyword}(?=$|[^a-z0-9])`, "i").test(text)
    );

    if (match) {
      return category;
    }
  }

  return "general";
}

function getMinutes(baseMinutes, energy) {
  const multiplier =
    energyLevels[energy]?.multiplier ??
    energyLevels.normal.multiplier;

  return Math.max(2, Math.round(baseMinutes * multiplier));
}

function makeStep(id, title, detail, minutes) {
  return {
    id,
    title,
    detail,
    minutes,
  };
}

function createStudySteps(goal, energy) {
  return [
    makeStep(
      "study-1",
      "OPEN THE BATTLEFIELD",
      `Open exactly what you need for "${goal}". Pick just one chapter, topic, or question to begin with.`,
      getMinutes(5, energy)
    ),

    makeStep(
      "study-2",
      "GET A QUICK WIN",
      `Work on the easiest useful part of "${goal}". Don't try to finish everything yet.`,
      getMinutes(12, energy)
    ),

    makeStep(
      "study-3",
      "LOCK IT IN",
      "Close your notes for a moment and recall three things you just learned. Mark anything you couldn't remember.",
      getMinutes(8, energy)
    ),
  ];
}

function createCodeSteps(goal, energy) {
  return [
    makeStep(
      "code-1",
      "MAKE IT RUN",
      `Open "${goal}" and get the smallest working version running. Ignore polish for now.`,
      getMinutes(8, energy)
    ),

    makeStep(
      "code-2",
      "BUILD ONE REAL THING",
      "Pick one visible feature and make it work from start to finish before adding anything else.",
      getMinutes(18, energy)
    ),

    makeStep(
      "code-3",
      "BREAK IT ON PURPOSE",
      "Test the feature with weird inputs, small screens, refreshes, and fast clicking. Fix the first real issue you find.",
      getMinutes(12, energy)
    ),
  ];
}

function createWritingSteps(goal, energy) {
  return [
    makeStep(
      "write-1",
      "WRITE THE UGLY FIRST LINE",
      `Open "${goal}" and write the first useful sentence or heading. Don't edit it yet.`,
      getMinutes(5, energy)
    ),

    makeStep(
      "write-2",
      "BUILD THE MIDDLE",
      "Add the three most important points you need to communicate. Rough is completely fine.",
      getMinutes(15, energy)
    ),

    makeStep(
      "write-3",
      "CLEAN THE MESS",
      "Read it once. Remove repetition, fix obvious mistakes, and make the main point easy to understand.",
      getMinutes(10, energy)
    ),
  ];
}

function createCleaningSteps(goal, energy) {
  return [
    makeStep(
      "clean-1",
      "CLEAR ONE ZONE",
      `Choose one tiny area related to "${goal}". Don't touch anything outside that zone yet.`,
      getMinutes(5, energy)
    ),

    makeStep(
      "clean-2",
      "REMOVE THE CHAOS",
      "Put obvious trash away first, then return misplaced items to where they belong.",
      getMinutes(10, energy)
    ),

    makeStep(
      "clean-3",
      "FINAL SWEEP",
      "Do one quick final pass and stop when the area looks clearly better than when you started.",
      getMinutes(8, energy)
    ),
  ];
}

function createReadingSteps(goal, energy) {
  return [
    makeStep(
      "read-1",
      "OPEN AND START",
      `Open "${goal}" and read only the first small section. No giant reading target.`,
      getMinutes(6, energy)
    ),

    makeStep(
      "read-2",
      "KEEP THE MOMENTUM",
      "Continue until you reach a natural stopping point. Mark anything confusing instead of getting stuck.",
      getMinutes(12, energy)
    ),

    makeStep(
      "read-3",
      "ONE-LINE RECAP",
      "Say or write one sentence explaining what you just read.",
      getMinutes(4, energy)
    ),
  ];
}

function createPlanningSteps(goal, energy) {
  return [
    makeStep(
      "plan-1",
      "NAME THE FINISH LINE",
      `Write what "done" actually means for "${goal}" in one sentence.`,
      getMinutes(5, energy)
    ),

    makeStep(
      "plan-2",
      "CUT IT DOWN",
      "Choose the three actions that matter most. Ignore everything optional for now.",
      getMinutes(10, energy)
    ),

    makeStep(
      "plan-3",
      "DO, DON'T PLAN",
      "Start the first action immediately. The plan is now finished enough.",
      getMinutes(10, energy)
    ),
  ];
}

function createGeneralSteps(goal, energy) {
  return [
    makeStep(
      "general-1",
      "MAKE IT TINY",
      `Find the smallest physical action that moves "${goal}" forward and do only that.`,
      getMinutes(5, energy)
    ),

    makeStep(
      "general-2",
      "BUILD MOMENTUM",
      `Continue "${goal}" until you've completed one clearly useful chunk.`,
      getMinutes(12, energy)
    ),

    makeStep(
      "general-3",
      "FINISH THE ROUND",
      "Check what changed, decide the next obvious move, and leave yourself an easy place to continue.",
      getMinutes(8, energy)
    ),
  ];
}

export function createQuestPlan(goal, energy = "normal") {
  const cleanedGoal = cleanGoal(goal);

  if (!cleanedGoal) {
    return [];
  }

  const category = detectCategory(cleanedGoal);

  switch (category) {
    case "study":
      return createStudySteps(cleanedGoal, energy);

    case "code":
      return createCodeSteps(cleanedGoal, energy);

    case "write":
      return createWritingSteps(cleanedGoal, energy);

    case "clean":
      return createCleaningSteps(cleanedGoal, energy);

    case "read":
      return createReadingSteps(cleanedGoal, energy);

    case "plan":
      return createPlanningSteps(cleanedGoal, energy);

    default:
      return createGeneralSteps(cleanedGoal, energy);
  }
}