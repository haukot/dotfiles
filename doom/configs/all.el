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


;; Vertico
;; TODO: имеет смысл только если vertico снизу в минибуффере показывать? Иначе все
;; равно нормально не видно
;;
;; (when (modulep! :completion vertico)
;;   (after! consult
;;           (setq consult--customize-alist nil)
;;     (consult-customize
;;             :preview-key '(:debounce 0.4 any))))
