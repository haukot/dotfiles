;;; fullscreen-mode-autoloads.el --- automatically extracted autoloads
;;
;;; Code:
(add-to-list 'load-path (or (file-name-directory #$) (car load-path)))

;;;### (autoloads nil "fullscreen-mode" "fullscreen-mode.el" (21777
;;;;;;  57851 331723 205000))
;;; Generated autoloads from fullscreen-mode.el

(autoload 'fullscreen-mode-fullscreen "fullscreen-mode" "\
Sets frame's fullscreen parameter to fullboth

\(fn)" t nil)

(autoload 'fullscreen-mode-windowed "fullscreen-mode" "\
Set frame's fullscreen parameter back to it's previous windowed state

\(fn)" t nil)

(autoload 'fullscreen-mode-fullscreen-toggle "fullscreen-mode" "\
Toggles the frame's fullscreen state

\(fn)" t nil)

(defvar fullscreen-mode nil "\
Non-nil if Fullscreen mode is enabled.
See the command `fullscreen-mode' for a description of this minor mode.")

(custom-autoload 'fullscreen-mode "fullscreen-mode" nil)

(autoload 'fullscreen-mode "fullscreen-mode" "\
Provides fullscreen-mode-toggle, bound to F11 that toggles the frame between fullscreen and windowed.

\(fn &optional ARG)" t nil)

;;;***

;; Local Variables:
;; version-control: never
;; no-byte-compile: t
;; no-update-autoloads: t
;; End:
;;; fullscreen-mode-autoloads.el ends here
