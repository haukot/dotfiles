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


;;; ---------------------------------------------------------------------------
;;; End Packages
;;; ---------------------------------------------------------------------------

(defun my-skype ()
  (interactive)
  (add-to-list 'load-path (concat "packages" "emacs-skype"))
  (require 'skype)
  (setq skype--my-user-handle "haudvd@gmail.com")
  (global-set-key (kbd "M-9") 'skype--anything-command))

;;; ---------------------------------------------------------------------------
;;; Requires
;;; ---------------------------------------------------------------------------

(require 'rainbow-delimiters)
(require 'flymake)
(require 'evil)
;(require 'erlang-flymake)


;;; ---------------------------------------------------------------------------
;;; End Requires
;;; ---------------------------------------------------------------------------

(windmove-default-keybindings) 
(evil-mode 1)

(setq custom-file "~/.emacs.d/custom.el")
(load custom-file)
;(server-start)


