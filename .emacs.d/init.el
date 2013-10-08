;;; ---------------------------------------------------------------------------
;;; Packages
;;; ---------------------------------------------------------------------------

(require 'package)
(add-to-list 'package-archives
             '("marmalade" . "http://marmalade-repo.org/packages/"))
(package-initialize)

(when (not package-archive-contents)
  (package-refresh-contents))

;; Add in your own as you wish:
(defvar my-packages '(  starter-kit
			starter-kit-js
			starter-kit-eshell
			marmalade
                        ; erlang
			erlang
                        ; ruby and rails
			starter-kit-ruby
                        haml-mode
			rinari
			ruby-end
			; hz
			find-file-in-project			
			rainbow-delimiters
			rainbow-mode)
  "A list of packages to ensure are installed at launch.")

(dolist (p my-packages)
  (when (not (package-installed-p p))
    (package-install p)))




(add-to-list 'load-path "~/.emacs.d/haukot/powerline")
(add-to-list 'load-path "~/.emacs.d/haukot/configs/")

;;; ---------------------------------------------------------------------------
;;; End Packages
;;; ---------------------------------------------------------------------------

(setq load-path (cons  "/usr/lib/erlang/lib/tools-2.6.11/emacs"
    load-path))
(setq erlang-root-dir "/usr/lib/erlang")
(setq exec-path (cons "/usr/lib/erlang/bin" exec-path))

;;; ---------------------------------------------------------------------------
;;; Requires
;;; ---------------------------------------------------------------------------

(require 'rainbow-delimiters)
(require 'flymake)
(require 'evil)
(require 'powerline)
(require 'powerline-evil-theme)
;(require 'erlang-flymake)
(require 'erlang-start)


;;; ---------------------------------------------------------------------------
;;; End Requires
;;; ---------------------------------------------------------------------------


(windmove-default-keybindings) 
(evil-mode 1)
(powerline-evil-theme)

(setq custom-file "~/.emacs.d/custom.el")
(load custom-file)
;(server-start)


