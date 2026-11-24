"""Exercise the production build with Chrome. Run after npm run build."""
import json
import shutil
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread

from playwright.sync_api import expect, sync_playwright


def verify(browser, port, width):
    context = browser.new_context(viewport={"width": width, "height": 820})
    page = context.new_page()
    page.goto(f"http://127.0.0.1:{port}")
    goal = page.get_by_label("WHAT ARE YOU STUCK ON?")
    page.get_by_role("button", name="Tidy my workspace").click()
    expect(goal).to_be_focused()
    expect(goal).to_have_value("Tidy my workspace")
    goal.fill("Tidy my desk")
    page.reload()
    expect(goal).to_have_value("Tidy my desk")
    expect(page.get_by_role("group", name="Example goals")).to_have_count(0)
    page.get_by_role("button", name="DISCARD DRAFT").click()
    expect(page.get_by_role("group", name="Example goals")).to_be_visible()
    history = [{"id": "finished", "goal": "Practice guitar", "energy": "low",
                "steps": [], "completedAt": 1700000000000}]
    page.evaluate("(data) => localStorage.setItem('questpop-history', data)", json.dumps(history))
    page.reload()

    history_button = page.locator("header button.history-button")
    replay = page.get_by_role("button", name="Restart Practice guitar")
    history_button.click()
    expect(page.get_by_role("button", name="Close history")).to_be_focused()
    replay.focus()
    replay.press("Enter")
    expect(page.get_by_role("dialog")).to_have_count(0)
    active = lambda: page.evaluate("JSON.parse(localStorage.getItem('questpop-active-quest'))")
    first = active()
    assert first["goal"] == history[0]["goal"] and first["energy"] == "low"
    assert first["id"] != "finished" and first["steps"]
    history_button.click()
    dialogs = []

    def cancel(dialog):
        dialogs.append(dialog.type)
        dialog.dismiss()

    page.once("dialog", cancel)
    replay.click()
    expect(replay).to_be_visible()
    assert dialogs == ["confirm"] and active() == first
    page.once("dialog", lambda dialog: dialog.accept())
    replay.click()
    expect(page.get_by_role("dialog")).to_have_count(0)
    assert active()["id"] != first["id"]
    assert page.evaluate("JSON.parse(localStorage.getItem('questpop-history'))") == history
    context.close()


with ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory="dist")) as server:
    Thread(target=server.serve_forever, daemon=True).start()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=shutil.which("google-chrome"))
        for width in (390, 1280):
            verify(browser, server.server_port, width)
        browser.close()
    server.shutdown()
