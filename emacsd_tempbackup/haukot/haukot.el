;;; ---------------------------------------------------------------------------
;;; User Interface
;;; ---------------------------------------------------------------------------

;;; fonts

  (when (string-equal system-type "gnu/linux")
    (if (find-font (font-spec :name "Nitti Light"))
        (set-default-font "Nitti Light-12")
      (set-default-font "Monospace-11")))



;;; ui

  (custom-set-variables '(echo-keystrokes 0.01)
			'(inhibit-startup-screen t)
			'(linum-format " %d ")
                        '(show-paren-delay 0)
                        '(frame-title-format '("%f - " user-real-login-name "@" system-name)))
  (add-to-list 'custom-theme-load-path "~/.emacs.d/haukot/themes/")
  ;(load-theme 'solarized-dark t)
  (fset 'yes-or-no-p 'y-or-n-p)
  (column-number-mode t)
  (global-linum-mode t)
  (global-hl-line-mode t)
  (menu-bar-mode t)
  (scroll-bar-mode -1)
  ;; Truncate lines everywhere
  (set-default 'truncate-lines t)
  (setq truncate-partial-width-windows nil)
  ;; Show Paren mode
  (show-paren-mode t)
  (set-face-attribute 'show-paren-match-face nil :underline t)
  (set-face-attribute 'default nil :height 120)
  ;; ---------------
  (tool-bar-mode t)
  (which-function-mode t)


;;; ---------------------------------------------------------------------------
;;; End User Interface
;;; ---------------------------------------------------------------------------




;;; ---------------------------------------------------------------------------
;;; Key Bindings
;;; ---------------------------------------------------------------------------


(global-set-key [f6] 'sr-speedbar-toggle)
(global-set-key (kbd "<f7>") 'fullscreen-mode-fullscreen-toggle)

;;; ---------------------------------------------------------------------------
;;; End Key Bindings
;;; ---------------------------------------------------------------------------




;;; ---------------------------------------------------------------------------
;;; Emacs Mode's
;;; ---------------------------------------------------------------------------

;; CSS and Rainbow modes
;(defun all-css-modes() (css-mode) (rainbow-mode))

;; Load both major and minor modes in one call based on file type
;(add-to-list 'auto-mode-alist '("\\.css$" . all-css-modes))
;(add-hook 'sass-mode-hook 'rainbow-mode)


;; Erlang mode
(add-to-list 'auto-mode-alist '("\\.erl?$" . erlang-mode))
(add-to-list 'auto-mode-alist '("\\.escript?$" . erlang-mode))
(add-to-list 'auto-mode-alist '("\\.hrl?$" . erlang-mode))

;(add-hook 'erlang-mode-hook 'prog-mode)

;; Rainbow Delimiters ((()))
(add-hook 'prog-mode-hook 'rainbow-delimiters-mode)

;; YARI (rails)
(define-key 'help-command "R" 'yari)

;;; ---------------------------------------------------------------------------
;;; End Emacs Mode's
;;; ---------------------------------------------------------------------------


