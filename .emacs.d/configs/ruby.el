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
