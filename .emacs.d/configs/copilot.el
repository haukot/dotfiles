(load-file "~/.emacs.d/packages/copilot.el/copilot.el")

(require 's)
(require 'dash)
(require 'editorconfig)

(add-hook 'prog-mode-hook 'copilot-mode)
;; (with-eval-after-load 'company
;;   ;; disable inline previews
;;   (delq 'company-preview-if-just-one-frontend company-frontends))

;; (define-key copilot-completion-map (kbd "<tab>") 'copilot-accept-completion)
;; (define-key copilot-completion-map (kbd "TAB") 'copilot-accept-completion)

(defun my/copilot-tab ()
  (interactive)
  (or (copilot-accept-completion)
      (indent-for-tab-command)))

(with-eval-after-load 'copilot
  (define-key copilot-mode-map (kbd "<tab>") #'my/copilot-tab))
(with-eval-after-load 'copilot
  (evil-define-key 'insert copilot-mode-map
    (kbd "<tab>") #'my/copilot-tab))

(define-key copilot-mode-map (kbd "C-<tab>") 'copilot-next-completion)
(define-key copilot-mode-map (kbd "C-<iso-lefttab>") 'copilot-previous-completion)

(defun disable-copilot ()
  (interactive)
  (remove-hook 'prog-mode-hook 'copilot-mode)
    (dolist (buf (buffer-list))
        (with-current-buffer buf
        (when (bound-and-true-p copilot-mode)
          (copilot-mode -1)))
        )
    )

(defun enabled-copilot ()
  (interactive)
  (add-hook 'prog-mode-hook 'copilot-mode)
  (dolist (buf (buffer-list))
    (with-current-buffer buf
      (when (derived-mode-p 'prog-mode)
        (copilot-mode 1))))
  )


;; (with-eval-after-load 'company
;;   ;; disable inline previews
;;   (delq 'company-preview-if-just-one-frontend company-frontends))

;; (define-key copilot-completion-map (kbd "<tab>") 'copilot-accept-completion)
;; (define-key copilot-completion-map (kbd "TAB") 'copilot-accept-completion)
