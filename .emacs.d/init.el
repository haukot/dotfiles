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
			rainbow-delimiters
			rainbow-mode
			rinari
			ruby-end)
  "A list of packages to ensure are installed at launch.")

(dolist (p my-packages)
  (when (not (package-installed-p p))
    (package-install p)))


;;; ---------------------------------------------------------------------------
;;; End Packages
;;; ---------------------------------------------------------------------------



;;; ---------------------------------------------------------------------------
;;; Requires
;;; ---------------------------------------------------------------------------

(require 'rainbow-delimiters)

;;; ---------------------------------------------------------------------------
;;; End Requires
;;; ---------------------------------------------------------------------------


(setq custom-file "~/.emacs.d/custom.el")
(load custom-file)
(server-start)


