;;; code.el --- asht                                 -*- lexical-binding: t; -*-

(global-auto-revert-mode -1)

(setq tab-width 2)
(setq indent-tabs-mode nil)
(setq standard-indent 2)
(setq tab-always-indent 'complete)
;; 2 spaces for all lisp modes
(setq-default
  lisp-indent-offset 2
  lisp-body-indent 2
  lisp-backquote-indentation 2
  scheme-indent-offset 2)

(defun my/save-buffer-message (&rest _)
  "Display a message in the minibuffer after saving a file."
  (message "Saved"))

(advice-add 'save-buffer :after #'my/save-buffer-message)


;;; Undo tree
(after! undo
        (setq undo-tree-enable-undo-in-region nil))

;;
;; Disable auto completion(because Copilot is main completion engine)
;;
(setq company-idle-delay nil)
(global-set-key (kbd "C-c c") #'company-manual-begin)

;; (setq lsp-log-io t)
(after! lsp-mode
        (setq lsp-disabled-clients
                '(
                         ;; ruby-ls ;; - solargraph ;; TODO disable
                         ruby-syntax-tree-ls
                         rubocop-ls
                         sorbet-ls
                         steep-ls
                         semgrep-ls ;; что это?
                         typeprof-ls
                         ))
        (setq lsp-ruby-lsp-use-bundler nil)

        ;; (defun lsp-ruby-lsp--build-command ()
        ;;         (append '("BUNDLE_GEMFILE=/home/haukot/programming/projects/slurm/slurm/.my-ruby-lsp/Gemfile bundle exec ruby-lsp")))
        )
;; (add-hook 'ruby-mode-hook (lambda () (setq-local lsp-enabled-clients '(ruby-ls))))


;;
;; Horizontal scroll
;;
(setq mouse-wheel-tilt-scroll t)
(setq mouse-wheel-flip-direction t)
;; TODO: можно включить, когда буду готов править лаги, т.к. в рубевых файлах неюзабельно
;; ;; Smooth scroll https://def.lakaban.net/2023-03-05-high-quality-scrolling-emacs/
;; (pixel-scroll-precision-mode)
;; (setq mouse-wheel-progressive-speed nil)
;; (setq mouse-wheel-scroll-amount '(0.01))
;; (setq mouse-wheel-scroll-amount-horizontal '(0.0001))


(setq org-download-screenshot-method "flameshot")

;; flycheck only after save
(after! flycheck
  (setq flycheck-check-syntax-automatically '(save mode-enabled)))

;; disable auto parenthesis
(after! smartparens
  (smartparens-global-mode -1))
(add-hook! 'prog-mode-hook
  (electric-pair-local-mode -1))
(remove-hook 'doom-first-buffer-hook #'smartparens-global-mode)


;; make % in evil normal mode to go between beginning and end of ruby functions and blocks
(use-package! evil-matchit
  :after evil
  :config
  (global-evil-matchit-mode 1))

;;
;; make C-x 1 to run C-x 1, and C-x 1 to C-x 1 + C-x 3
;;
(defun my-delete-other-windows-then-split-vertically-and-focus-right ()
  "Delete other windows, split vertically, and focus on the right window."
  (interactive)
  (delete-other-windows)
  (let ((new-window (split-window-right)))
    (select-window new-window)))

(defun my-original-delete-other-windows ()
  "The original functionality of delete-other-windows (C-x 1)."
  (interactive)
  (delete-other-windows))

(map! "C-x 1" #'my-delete-other-windows-then-split-vertically-and-focus-right
      "C-x 5" #'my-original-delete-other-windows)

;; Отключение lsp
;; (remove-hook 'ruby-mode-local-vars-hook #'lsp!)

(map! :map dired-mode-map
      "<backspace>" #'dired-up-directory)

;; чтобы перемещение между окнами в insert state работало
;; почему-то влево-вправо не было
(map! :map evil-insert-state-map
      "S-<left>"  #'windmove-left
      "S-<right>" #'windmove-right
      "S-<up>"    #'windmove-up
      "S-<down>"  #'windmove-down)

(map! :map evil-insert-state-map "<tab>" #'indent-according-to-mode)
(map! :map evil-normal-state-map "<tab>" #'indent-according-to-mode)
