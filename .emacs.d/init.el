;;; Для дебага(не прям работало)

;; https://github.com/Malabarba/elisp-bug-hunter - для bisect'a ошибок при стартапе

;; Эта штука должна была работать для warning'ов при стартапе - но почему-то не работает
;; (defun dont-delay-compile-warnings (fun type &rest args)
;;       (let ((after-init-time t))
;;         (apply fun type args)))
;; (advice-add 'display-warning :around #'dont-delay-compile-warnings)

;; emacs --debug-init

;; (setq debug-on-error t)
;; (setq warning-minimum-level :debug)
;; (setq debug-on-message ".*be defined as a symbol.*")


;;; ---------------------------------------------------------------------------
;;; Packages
;;; ---------------------------------------------------------------------------

(require 'package)
;; (add-to-list 'package-archives
;;              '("marmalade" . "http://marmalade-repo.org/packages/") t)

;; (add-to-list 'package-archives
;;              '("melpa-stable" . "http://stable.melpa.org/packages/") t)
;; (add-to-list 'package-archives
;;              '("melpa" . "http://melpa.milkbox.net/packages/") t)
(add-to-list 'package-archives
             '("melpa-n" . "https://melpa.org/packages/") t)

(setq package-enable-at-startup nil)
(package-initialize)

(when (not package-archive-contents)
  (package-refresh-contents))

;; раньше здесь был emacs-starter-kit
;; Add in your own as you wish:
(defvar my-packages '(
											marmalade
											evil
											evil-paredit
                                            evil-surround
                                            evil-commentary
                                            evil-matchit
											helm-projectile
											flx
											flx-ido
											flymake
											flymake-haml
											flymake-php
											flymake-ruby
											flymake-shell
											fullscreen-mode
											highlight-indentation ;; why
											jump ;; why
											less-css-mode
                                            ag
											sass-mode
											jsx-mode
											yasnippet
											wakatime-mode
											smex
											erlang
											emmet-mode
											php-mode
											haml-mode
											web-mode
											ruby-end
											find-file-in-project
											rainbow-delimiters
											flycheck
											web-mode
											js2-mode
											json-mode
											helm
                                            helm-ag
											projectile
											projectile-rails
											rainbow-delimiters
											rainbow-mode
                                            tide
                                            ;; for copilot
                                            dash
                                            editorconfig
                                            s
                                            ;; end for copilot
                                            )
  "A list of packages to ensure are installed at launch.")

(dolist (p my-packages)
  (when (not (package-installed-p p))
    (package-install p)))
;(dolist (package my-packages)
;	(lambda (package)
;		(or (package-installed-p package)
;				(if (y-or-n-p (format "Package %s is missing.  Install
;       it? " package))
;	   (package-install package))))
;	)

;; ;; NOTE: we disabled package.el.
;; ;; because: "While it is technically possible to use both package.el and
;; ;; straight.el at the same time, there is no real reason to, and it might
;; ;; result in oddities like packages getting loaded more than once."
;; ;;;;;;;;;
;; ;; straight.el
;; (setq straight-recipes-emacsmirror-use-mirror nil)
;; (setq straight-recipes-gnu-elpa-use-mirror nil)
;; (defvar bootstrap-version)
;; (let ((bootstrap-file
;;        (expand-file-name "straight/repos/straight.el/bootstrap.el" user-emacs-directory))
;;       (bootstrap-version 6))
;;   (unless (file-exists-p bootstrap-file)
;;     (with-current-buffer
;;         (url-retrieve-synchronously
;;          "https://raw.githubusercontent.com/radian-software/straight.el/develop/install.el"
;;          'silent 'inhibit-cookies)
;;       (goto-char (point-max))
;;       (eval-print-last-sexp)))
;;   (load bootstrap-file nil 'nomessage))

;; ;;;;;;;;
;; ;;;;;;;;

;; ;; need https://github.com/radian-software/straight.el for this
;; (use-package copilot
;;   :straight (:host github :repo "zerolfx/copilot.el" :files ("dist" "*.el"))
;;   :ensure t)


(add-to-list 'load-path "~/.emacs.d/elpa")
(add-to-list 'load-path "~/.emacs.d/packages/emacs-nav-49")
(add-to-list 'load-path "~/.emacs.d/haukot/powerline")
(add-to-list 'load-path "~/.emacs.d/haukot/configs/")
;;(add-to-list 'load-path "~/.emacs.d/haukot/")

;; (add-to-list 'load-path "~/.emacs.d/haukot/haukot.el")
(add-to-list 'load-path "~/.emacs.d/plugins/yasnippet")
;;;https://github.com/eschulte/yasnippets-rails not in dotfiles

;;(setq rsense-home "/usr/lib/rsense-0.3")
;;(add-to-list 'load-path (concat rsense-home "/etc"))

;;; ---------------------------------------------------------------------------
;;; End Packages
;;; ---------------------------------------------------------------------------

(setq load-path (cons  "/usr/lib/erlang/lib/tools-2.6.11/emacs"
    load-path))
(setq erlang-root-dir "/usr/lib/erlang")
(setq exec-path (cons "/usr/lib/erlang/bin" exec-path))

(defconst user-init-dir
  (cond ((boundp 'user-emacs-directory)
         "~/.emacs.d/configs")
        ((boundp 'user-init-directory)
         "~/.emacs.d/configs")
        (t "~/.emacs.d/")))


(defun load-user-file (file)
  (interactive "f")
  "Load a file in current user's configuration directory"
  (load-file (expand-file-name file user-init-dir)))

(load-user-file "all.el")
(load-user-file "starter_kit.el")
(load-user-file "helm.el")
(load-user-file "projectile.el")
(load-user-file "evil.el")
(load-user-file "vterm.el")
(load-user-file "wakatime.el")
(load-user-file "js.el")
(load-user-file "evil_macroses.el")
(load-user-file "utils.el")
(load-user-file "erlang.el")
(load-user-file "go.el")
(load-user-file "eshell.el")
(load-user-file "copilot.el")
(load-user-file "ruby.el")
(load-user-file "move.el")


;; (set-face-background 'fringe "grey")
(fringe-mode '(8 . 0))
(window-divider-mode)
(set-face-attribute 'fringe nil :background "white")
(set-face-attribute 'window-divider nil :background "white" :foreground "white")
(set-face-attribute 'window-divider-last-pixel nil :background "white" :foreground "white")
;; (set-window-margins nil nil)

;;;; To change powerline(bottom bar) color
;; (set-face-background 'mode-line "white")
;; (set-face-background 'mode-line-inactive "white")
(set-face-foreground 'powerline-active1 "grey40")
(set-face-background 'powerline-active1 "grey40")
;; (set-face-background 'powerline-active2 "white")

(menu-bar-mode -1)

(setq magit-auto-revert-mode nil)
