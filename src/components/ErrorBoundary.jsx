import React from "react";

export default class ErrorBoundary
  extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error,
    info
  ) {
    console.error(
      "QuestPop crashed:",
      error,
      info
    );
  }

  resetApp = () => {
    try {
      localStorage.removeItem(
        "questpop-active-quest"
      );
    } catch {
      // Ignore storage failure.
    }

    window.location.reload();
  };

  render() {
    if (
      this.state.hasError
    ) {
      return (
        <main className="error-screen">
          <div className="error-card">
            <div className="error-emoji">
              💥
            </div>

            <span className="error-tag">
              WHOOPS!
            </span>

            <h1>
              QUESTPOP
              <br />
              HIT A WALL.
            </h1>

            <p>
              Your browser ran into
              something weird. Your
              completed history is
              still safe.
            </p>

            <button
              type="button"
              onClick={
                this.resetApp
              }
            >
              ⚡ FIX & RELOAD
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}