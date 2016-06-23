;;; ---------------------------------------------------------------------------
;;; Packages
;;; ---------------------------------------------------------------------------

(require 'package)
(add-to-list 'package-archives
             '("marmalade" . "http://marmalade-repo.org/packages/"))
(add-to-list 'package-archives
             '("melpa" . "http://melpa.milkbox.net/packages/"))

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
											rainbow-mode)
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



(add-to-list 'load-path "~/.emacs.d/elpa")
(add-to-list 'load-path "~/.emacs.d/packages/emacs-nav-49")
(add-to-list 'load-path "~/.emacs.d/haukot/powerline")
(add-to-list 'load-path "~/.emacs.d/haukot/configs/")
(add-to-list 'load-path "~/.emacs.d/haukot/haukot.el")
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
(load-user-file "wakatime.el")
(load-user-file "js.el")
(load-user-file "evil_macroses.el")
(load-user-file "utils.el")
(load-user-file "erlang.el")
(load-user-file "eshell.el")

(require 'alchemist)
