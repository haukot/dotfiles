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
