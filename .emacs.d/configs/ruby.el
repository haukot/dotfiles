;; ruby-modu no encoding string
(setq ruby-insert-encoding-magic-comment nil)

;; enh-ruby-mode no encoding string
(defun remove-enh-magic-comment ()
  (remove-hook 'before-save-hook 'enh-ruby-mode-set-encoding t))
(add-hook 'enh-ruby-mode-hook 'remove-enh-magic-comment)

;; (add-hook 'enh-ruby-mode-hook (lambda () (symbol-overlay-mode -1)))
;; (add-hook 'enh-ruby-mode-hook (lambda () (highlight-symbol-mode -1)))
;; (add-hook 'enh-ruby-mode-hook (lambda () (auto-highlight-symbol-mode -1)))
;; (add-hook 'enh-ruby-mode-hook (lambda () (highlight-indentation-current-column-mode -1)))


(add-to-list 'auto-mode-alist
             '("\\(?:\\.rb\\|ru\\|rake\\|thor\\|jbuilder\\|gemspec\\|podspec\\|/\\(?:Gem\\|Rake\\|Cap\\|Thor\\|Vagrant\\|Guard\\|Pod\\)file\\)\\'" . enh-ruby-mode))

;; TODO: remove after PR merge
(add-to-list 'copilot-major-mode-alist '("js2" . "javascript"))
(add-to-list 'copilot-major-mode-alist '("enh-ruby" . "ruby"))



;; TODO
;; Additionally, consider adding
;; (add-hook 'compilation-filter-hook 'inf-ruby-auto-enter)
;; or
;; (add-hook 'compilation-filter-hook 'inf-ruby-auto-enter-and-focus)
;; to your init file to automatically switch from common Ruby compilation modes to interact with a debugger. The latter snippet will also select the compilation window and move point to the breakpoint prompt.



;; Чтобы вызывало rails c в основном проекте, а не внутри engine(т.к. в engine gemspec)
;; TODO: но это одновременно ломает консоль в гемах?
;; from https://github.com/nonsequitur/inf-ruby/blob/master/inf-ruby.el#L1022C1-L1033C34
(setq inf-ruby-console-patterns-alist
  '((".zeus.sock" . zeus)
    ;; TODO: добавить docker-rails? вообще бы что-то более расширяемое, а не код внутри править
    ("dip.yml" . diprails)
    ("dip.yml" . dipdebug)
    ("dip.yml" . diprspec)
    (inf-ruby-console-rails-p . rails)
    (inf-ruby-console-hanami-p . hanami)
    (inf-ruby-console-script-p . script)
    ;;("*.gemspec" . gem)
    (inf-ruby-console-racksh-p . racksh)
    ;;("Gemfile" . default)
    )
)

;; (defun inf-ruby-activate-debug ()
;;   (interactive)
;;   (inf-ruby-auto-enter))

;; TODO: TEMPORALLY FUNCTION
    (defun my/vterm-execute-current-line ()
      "Insert text of current line in vterm and execute."
      (interactive)
      (require 'vterm)
      (eval-when-compile (require 'subr-x))
      (let ((command (string-trim (buffer-substring
                                   (save-excursion
                                     (beginning-of-line)
                                     (point))
                                   (save-excursion
                                     (end-of-line)
                                     (point))))))
        (let ((buf (current-buffer)))
          (unless (get-buffer vterm-buffer-name)
            (vterm))
          (display-buffer vterm-buffer-name t)
          (switch-to-buffer-other-window vterm-buffer-name)
          (vterm--goto-line -1)
          (message command)
          (vterm-send-string command)
          (vterm-send-return)
          (switch-to-buffer-other-window buf)
          )))

;; TODO for inf-ruby:
;; add to .pryrc Pry.commands.delete /\.(.*)/
;; to remove problems with multiline insert https://github.com/nonsequitur/inf-ruby/issues/139

(defun ruby-send-region-or-between-lines ()
  (interactive)
  (save-excursion
    (unless (use-region-p)
      (let ((beg nil) (end nil))
        (save-excursion
          (if (re-search-backward (rx bol (* blank) eol) nil t nil)
              (setq beg (point))
            (setq beg (point-min)))
          (forward-char)
          (if (re-search-forward (rx bol (* blank) eol) nil t nil)
              (setq end (- (point) 1))
            (setq end (point-max))))
        (push-mark beg)
        (goto-char end)
        (activate-mark)))
    (ruby-send-region (region-beginning) (region-end)))
  (deactivate-mark))

;; C-l is buffer centering %)
;; (global-set-key (kbd "C-l") 'ruby-send-region-or-between-lines)
(with-eval-after-load 'evil
  (define-key evil-normal-state-map (kbd "l") 'ruby-send-region-or-between-lines)
  (define-key evil-visual-state-map (kbd "l") 'ruby-send-region-or-between-lines))



;;; Rspec-mode
(setq rspec-use-docker-when-possible t)
(setq rspec-docker-command "dip compose exec")
(setq rspec-use-bundler-when-possible nil)
;; (setq rspec-docker-command "docker-compose -f .dockerdev/compose.yml exec")
(setq rspec-docker-file-name ".dockerdev/compose.yml")
(setq rspec-docker-container "web")

(defun rspec--docker-default-wrapper (docker-command docker-container command)
  "Function for wrapping a command for execution inside a dockerized environment. "
  (format "%s %s 'sh -c \"%s\"'" docker-command docker-container command))
