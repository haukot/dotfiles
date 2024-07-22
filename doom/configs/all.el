;;; code.el --- asht                                 -*- lexical-binding: t; -*-

(setq-default tab-width 2)
(setq-default indent-tabs-mode nil)
(setq-default standard-indent 2)
(setq-default tab-always-indent 'complete)
(setq lisp-indent-offset 2)

(defun my/save-buffer-message (&rest _)
  "Display a message in the minibuffer after saving a file."
  (message "Saved"))

(advice-add 'save-buffer :after #'my/save-buffer-message)
