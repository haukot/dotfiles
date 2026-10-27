import json
import os
import subprocess


def main():
    binary = os.environ["HERDR_BIN_PATH"]
    keep = os.environ["HERDR_ACTIVE_PANE_ID"]
    tab = os.environ["HERDR_ACTIVE_TAB_ID"]
    workspace = os.environ["HERDR_ACTIVE_WORKSPACE_ID"]

    def panes():
        output = subprocess.check_output(
            [binary, "pane", "list", "--workspace", workspace], text=True
        )
        return json.loads(output)["result"]["panes"]

    candidates = panes()
    for pane in candidates:
        if pane["tab_id"] != tab or pane["pane_id"] == keep:
            continue
        # Recheck membership before closing in case panes moved or closed.
        current = panes()
        if not any(p["pane_id"] == keep and p["tab_id"] == tab for p in current):
            raise RuntimeError("The pane to keep is no longer in the active tab")
        if any(p["pane_id"] == pane["pane_id"] and p["tab_id"] == tab for p in current):
            subprocess.run([binary, "pane", "close", pane["pane_id"]], check=True)


if __name__ == "__main__":
    main()
