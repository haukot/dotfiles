import json
import os
from pathlib import Path
import runpy
import string
import subprocess
import tempfile
import unittest
from unittest.mock import patch

script = runpy.run_path(str(Path(__file__).with_name("new-alphabetic-tab.py")))


class AlphabeticTabsTest(unittest.TestCase):
    def test_names(self):
        choose = script["first_unused_name"]
        self.assertEqual(choose([]), "a")
        self.assertEqual(choose(["a", "c", "1", "project"]), "b")
        self.assertEqual(choose(string.ascii_lowercase), "aa")
        self.assertEqual(choose([*string.ascii_lowercase, "aa"]), "ab")

    def test_current_workspace_and_cwd(self):
        env = {"HERDR_BIN_PATH": "herdr", "HERDR_ACTIVE_WORKSPACE_ID": "w2",
               "HERDR_ACTIVE_PANE_CWD": "/tmp/a directory"}
        with tempfile.TemporaryFile() as lock, patch.dict(os.environ, env, clear=True), \
                patch("builtins.open", return_value=lock), \
                patch("subprocess.check_output", return_value=json.dumps(
                    {"result": {"tabs": [{"label": "a"}, {"label": "c"}]}}
                )) as read, patch("subprocess.run") as create:
            script["main"]()
            read.assert_called_once_with(["herdr", "tab", "list", "--workspace", "w2"], text=True)
            create.assert_called_once_with(
                ["herdr", "tab", "create", "--workspace", "w2", "--label", "b",
                 "--focus", "--cwd", "/tmp/a directory"], check=True)

    def test_failed_listing_does_not_create(self):
        env = {"HERDR_BIN_PATH": "herdr", "HERDR_ACTIVE_WORKSPACE_ID": "w2"}
        with tempfile.TemporaryFile() as lock, patch.dict(os.environ, env, clear=True), \
                patch("builtins.open", return_value=lock), \
                patch("subprocess.check_output", side_effect=subprocess.CalledProcessError(1, "herdr")), \
                patch("subprocess.run") as create:
            with self.assertRaises(subprocess.CalledProcessError):
                script["main"]()
            create.assert_not_called()


if __name__ == "__main__":
    unittest.main()
