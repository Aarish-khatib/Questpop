import {
  useCallback,
  useState,
} from "react";

import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuestInput from "./components/QuestInput";
import QuestCard from "./components/QuestCard";
import ProgressBar from "./components/ProgressBar";
import CompletionScreen from "./components/CompletionScreen";
import HistoryPanel from "./components/HistoryPanel";
import Toast from "./components/Toast";

import useQuest from "./hooks/useQuest";

export default function App() {
  const {
    quest,

    activeStep,

    progress,

    history,

    stats,

    startQuest,

    completeCurrentStep,

    resetQuest,

    removeHistoryQuest,

    clearHistory,
  } = useQuest();

  const [
    historyOpen,
    setHistoryOpen,
  ] = useState(false);

  const [
    toast,
    setToast,
  ] = useState("");

  const hasQuest =
    quest.steps.length > 0;

  const showHome =
    !hasQuest &&
    !quest.completed;

  const hideToast =
    useCallback(() => {
      setToast("");
    }, []);

  function handleCompleteStep() {
    const result =
      completeCurrentStep();

    if (
      result === "advanced"
    ) {
      setToast(
        "MISSION CLEARED!"
      );
    }

    if (
      result === "completed"
    ) {
      setToast(
        "QUEST COMPLETE!"
      );
    }
  }

  function handleNewQuest() {
    if (
      hasQuest &&
      !quest.completed
    ) {
      const confirmed =
        window.confirm(
          "Leave this quest and start a new one?"
        );

      if (!confirmed) {
        return;
      }
    }

    resetQuest();
  }

  return (
    <div className="app">
      <div
        className="comic-halftone"
        aria-hidden="true"
      />

      <div
        className="background-dot dot-one"
        aria-hidden="true"
      />

      <div
        className="background-dot dot-two"
        aria-hidden="true"
      />

      <div
        className="background-star star-one"
        aria-hidden="true"
      >
        ★
      </div>

      <div
        className="background-star star-two"
        aria-hidden="true"
      >
        ✦
      </div>

      <Navbar
        hasQuest={
          hasQuest ||
          quest.completed
        }
        historyCount={
          history.length
        }
        onNewQuest={
          handleNewQuest
        }
        onHistory={() =>
          setHistoryOpen(true)
        }
      />

      <main>
        {showHome && (
          <>
            <Hero />

            {history.length >
              0 && (
              <div className="welcome-back">
                <span>
                  ⚡ WELCOME BACK
                </span>

                <strong>
                  {
                    stats.completed
                  }{" "}
                  QUEST
                  {stats.completed ===
                  1
                    ? ""
                    : "S"}{" "}
                  CRUSHED
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    setHistoryOpen(
                      true
                    )
                  }
                >
                  VIEW HISTORY →
                </button>
              </div>
            )}

            <QuestInput
              onStart={
                startQuest
              }
            />
          </>
        )}

        {hasQuest &&
          !quest.completed && (
            <section className="quest-stage">
              <div className="quest-stage-title">
                <span className="tiny-tag">
                  YOUR QUEST
                </span>

                <h1>
                  ONE MOVE
                  <span>
                    {" "}
                    AT A TIME.
                  </span>
                </h1>
              </div>

              <ProgressBar
                currentIndex={
                  quest.currentIndex
                }
                totalSteps={
                  quest.steps.length
                }
                progress={
                  progress
                }
              />

              <QuestCard
                goal={
                  quest.goal
                }
                step={
                  activeStep
                }
                currentIndex={
                  quest.currentIndex
                }
                totalSteps={
                  quest.steps.length
                }
                onComplete={
                  handleCompleteStep
                }
              />
            </section>
          )}

        {quest.completed && (
          <CompletionScreen
            goal={
              quest.goal
            }
            onRestart={
              resetQuest
            }
          />
        )}
      </main>

      <HistoryPanel
        open={historyOpen}
        history={history}
        stats={stats}
        onClose={() =>
          setHistoryOpen(false)
        }
        onRemove={
          removeHistoryQuest
        }
        onClear={
          clearHistory
        }
      />

      <Toast
        message={toast}
        onDone={
          hideToast
        }
      />

      <footer className="footer">
        <strong>
          QUESTPOP!
        </strong>

        <span>
          FROM STUCK TO STARTED.
        </span>
      </footer>
    </div>
  );
}