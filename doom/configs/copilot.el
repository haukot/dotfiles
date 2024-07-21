;;; configs/copilot.el -*- lexical-binding: t; -*-
;;;

(define-key global-map (kbd "C-f") nil) ;; was forward-char before

(use-package! copilot
  :hook (prog-mode . copilot-mode)
  :bind (:map copilot-completion-map
              ("<tab>" . #'my/copilot-tab)
              ("TAB" . #'my/copilot-tab)
              ("C-<tab>" . 'copilot-next-completion)
              ("C-<iso-lefttab>" . 'copilot-previous-completion)
              ("C-f" . 'copilot-accept-completion-by-word))
  :config
  ;; (with-eval-after-load 'company
  ;;   ;; disable inline previews
  ;;   (delq 'company-preview-if-just-one-frontend company-frontends))

  ;; (define-key copilot-completion-map (kbd "<tab>") 'copilot-accept-completion)
  ;; (define-key copilot-completion-map (kbd "TAB") 'copilot-accept-completion)

  (defun my/copilot-tab ()
    (interactive)
    (or (copilot-accept-completion)
        (indent-for-tab-command)))

  (defun disable-copilot ()
    (interactive)
    (remove-hook 'prog-mode-hook 'copilot-mode)
    (dolist (buf (buffer-list))
      (with-current-buffer buf
        (when (bound-and-true-p copilot-mode)
          (copilot-mode -1)))
      )
    )

  (defun enable-copilot ()
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

  ;; Disable in comments
  (defun my-in-comment-p ()
    "Return t if the point is in a comment, nil otherwise."
    (nth 4 (syntax-ppss)))
  (add-to-list 'copilot-disable-display-predicates #'my-in-comment-p)

  ;; Cancel copilot overlay on C-g
  ;; from https://robert.kra.hn/posts/2023-02-22-copilot-emacs-setup/#ctrl-g--cancel
  (defun rk/copilot-quit ()
    "Run `copilot-clear-overlay' or `keyboard-quit'. If copilot is
cleared, make sure the overlay doesn't come back too soon."
    (interactive)
    (condition-case err
        (when copilot--overlay
          (lexical-let ((pre-copilot-disable-predicates copilot-disable-predicates))
                       (setq copilot-disable-predicates (list (lambda () t)))
                       (copilot-clear-overlay)
                       (run-with-idle-timer
                        1.0
                        nil
                        (lambda ()
                          (setq copilot-disable-predicates pre-copilot-disable-predicates)))))
      (error handler)))
  (advice-add 'keyboard-quit :before #'rk/copilot-quit)

  ;; (with-eval-after-load 'copilot
  ;;   (define-key copilot-completion-map (kbd "<tab>") #'my/copilot-tab))
  ;; (with-eval-after-load 'copilot
  ;;   (evil-define-key 'insert copilot-completion-map
  ;;     (kbd "<tab>") #'my/copilot-tab))

  ;; (define-key copilot-completion-map (kbd "C-<tab>") 'copilot-next-completion)
  ;; (define-key copilot-completion-map (kbd "C-<iso-lefttab>") 'copilot-previous-completion)
  ;; (define-key copilot-completion-map (kbd "C-f") #'copilot-accept-completion-by-word)

  ;; выключаем warning про неустановленную индентацию (был в emacs-lisp-mode)
  ;; https://github.com/copilot-emacs/copilot.el/issues/220
  (setq copilot-indent-offset-warning-disable t)
  )
