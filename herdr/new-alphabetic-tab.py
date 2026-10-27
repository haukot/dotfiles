import fcntl
import json
import os
from pathlib import Path
import subprocess


def first_unused_name(names):
    used = set(names)
    number = 1
    while True:
        value, name = number, ""
        while value:
            value, remainder = divmod(value - 1, 26)
            name = chr(ord("a") + remainder) + name
        if name not in used:
            return name
        number += 1


def main():
    binary = os.environ["HERDR_BIN_PATH"]
    workspace = os.environ["HERDR_ACTIVE_WORKSPACE_ID"]
    # Serialize shortcuts through creation so repeated presses get unique names.
    with open(Path(__file__).with_suffix(".lock"), "a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        output = subprocess.check_output(
            [binary, "tab", "list", "--workspace", workspace], text=True
        )
        tabs = json.loads(output)["result"]["tabs"]
        name = first_unused_name(tab["label"] for tab in tabs)
        command = [binary, "tab", "create", "--workspace", workspace, "--label", name, "--focus"]
        if cwd := os.environ.get("HERDR_ACTIVE_PANE_CWD"):
            command += ["--cwd", cwd]
        subprocess.run(command, check=True)


if __name__ == "__main__":
    main()
