;; use web-mode for .jsx files
;; (add-to-list 'auto-mode-alist '("\\.jsx$" . web-mode))

;; turn on flychecking globally
(add-hook 'after-init-hook #'global-flycheck-mode)

(add-to-list 'auto-mode-alist '("\\.tsx$" . typescript-mode))

;; disable jshint since we prefer eslint checking
(setq-default flycheck-disabled-checkers
  (append flycheck-disabled-checkers
    '(javascript-jshint)))

;; use eslint with web-mode for jsx files
(flycheck-add-mode 'javascript-eslint 'js-mode)

;; disable json-jsonlist checking for json files
(setq-default flycheck-disabled-checkers
  (append flycheck-disabled-checkers
    '(json-jsonlist)))

(setq flycheck-check-syntax-automatically '(new-line save))
;;(setq flycheck-idle-change-delay 2)

;; (add-hook 'web-mode-hook (lambda ()
;;         ;; short circuit js mode and just do everything in jsx-mode
;;         (if (equal web-mode-content-type "javascript")
;;             (web-mode-set-content-type "jsx")
;;           (message "now set to: %s" web-mode-content-type))))

(setq js-indent-level 2)


;; Tide mode - autocompletion, go to reference
(defun setup-tide-mode ()
  (interactive)
  (tide-setup)
  (flycheck-mode +1)
  (setq flycheck-check-syntax-automatically '(save mode-enabled))
  (eldoc-mode +1)
  (tide-hl-identifier-mode +1)
  ;; company is an optional dependency. You have to
  ;; install it separately via package-install
  ;; `M-x package-install [ret] company`
  (company-mode +1))
;;;; Disabled auto tide-mode because it eats memory
;; (flycheck-add-next-checker 'javascript-eslint 'javascript-tide 'append)
;; (add-hook 'js2-mode-hook (lambda ()
;;   (setup-tide-mode)))
;; (add-hook 'js-mode-hook (lambda ()
;;   (setup-tide-mode)))

(evil-define-key 'normal tide-mode-map
  "gt" 'tide-jump-to-definition
  (kbd "C-t") 'tide-jump-back
  "K" 'tide-documentation-at-point)

(evil-define-key 'normal tide-references-mode-map
  "gj" 'tide-find-next-reference
  "gk" 'tide-find-previous-reference
  (kbd "C-j") 'tide-find-next-reference
  (kbd "C-k") 'tide-find-previous-reference
  (kbd "RET") 'tide-goto-reference
  ;; quit
  "q" 'quit-window)


(add-to-list 'auto-mode-alist '("\\.vue$" . vue-mode))
(add-hook 'mmm-mode-hook
          (lambda ()
            (set-face-background 'mmm-default-submode-face nil)))
