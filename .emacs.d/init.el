;;; ---------------------------------------------------------------------------
;;; Packages
;;; ---------------------------------------------------------------------------

(require 'package)
(add-to-list 'package-archives
             '("marmalade" . "http://marmalade-repo.org/packages/"))
(add-to-list 'package-archives
             '("melpa" . "http://melpa.milkbox.net/packages/"))
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
			ruby-end
			; hz
			find-file-in-project
			rainbow-delimiters
			rainbow-mode)
  "A list of packages to ensure are installed at launch.")

(dolist (p my-packages)
  (when (not (package-installed-p p))
    (package-install p)))



(add-to-list 'load-path "~/.emacs.d/packages/emacs-nav-49")
(add-to-list 'load-path "~/.emacs.d/haukot/powerline")
(add-to-list 'load-path "~/.emacs.d/haukot/configs/")
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

;;; ---------------------------------------------------------------------------
;;; Requires
;;; ---------------------------------------------------------------------------

(require 'rainbow-delimiters)
(require 'flymake)
(require 'evil)
(require 'powerline)
(require 'powerline-evil-theme)
;(require 'erlang-flymake)
(require 'erlang)
(require 'yasnippet)
;;(require 'rsense)
(require 'nav)
;;(require 'whitespace)
(require 'emmet-mode)

;;; ---------------------------------------------------------------------------
;;; End Requires
;;; ---------------------------------------------------------------------------


;;; emmet-mode
(add-hook 'sgml-mode-hook 'emmet-mode) ;; Auto-start on any markup modes
(add-hook 'css-mode-hook  'emmet-mode) ;; enable Emmet's css abbreviation.
;;;;

;;; -------------------------
;;; ace jump

;;
;; ace jump mode major function
;;
(add-to-list 'load-path "/home/haukot/.emacs.d/packages/ace-jump-mode/")
(autoload
  'ace-jump-mode
  "ace-jump-mode"
  "Emacs quick move minor mode"
  t)
;; you can select the key you prefer to
(define-key global-map (kbd "C-c SPC") 'ace-jump-mode)

;;
;; enable a more powerful jump back function from ace jump mode
;;
(autoload
  'ace-jump-mode-pop-mark
  "ace-jump-mode"
  "Ace jump back:-)"
  t)
(eval-after-load "ace-jump-mode"
  '(ace-jump-mode-enable-mark-sync))
(define-key global-map (kbd "C-x SPC") 'ace-jump-mode-pop-mark)

;;If you use evil
(define-key evil-normal-state-map (kbd "SPC") 'ace-jump-mode)


;;; -------------------------


(nav-disable-overeager-window-splitting)

(windmove-default-keybindings)
(evil-mode 1)
(powerline-evil-theme)

(setq custom-file "~/.emacs.d/custom.el")
(load custom-file)
;(server-start)

(yas-global-mode 1)

(rainbow-delimiters-mode 1)

(setq wakatime-api-key "f808e6da-214f-48ae-8e2a-1f1d7639a10d")

;;(global-whitespace-mode)
(global-rainbow-delimiters-mode)

(put 'upcase-region 'disabled nil)


(require 'flymake-php)
(add-hook 'php-mode-hook 'flymake-php-load)

(require 'web-mode)
(add-to-list 'auto-mode-alist '("\\.php\\'" . php-mode))
(add-to-list 'auto-mode-alist '("\\.blade\\.php\\'" . web-mode))
(setq web-mode-engines-alist
      '(("php"    . "\\.phtml\\'")
        ("blade"  . "\\.blade\\."))
)


(add-hook 'before-save-hook 'delete-trailing-whitespace)


(setq ido-use-filename-at-point nil)
(put ffap-machine-p-known 'reject)

;;;; flx
(require 'flx-ido)
(ido-mode 1)
(ido-everywhere 1)
(flx-ido-mode 1)
;; disable ido faces to see flx highlights.
(setq ido-enable-flex-matching t)
(setq ido-use-faces nil)
;;;; end flx

(require 'autopair)
(autopair-global-mode)
(autopair-global-mode t)

(require 'projectile)
(projectile-global-mode)
(projectile-global-mode +1)
(add-hook 'ruby-mode-hook 'projectile-rails-mode)
(add-hook 'projectile-mode-hook 'projectile-rails-on)

;;; HELM
(require 'helm)
(require 'helm-config)


;; The default "C-x c" is quite close to "C-x C-c", which quits Emacs.
;; Changed to "C-c h". Note: We must set "C-c h" globally, because we
;; cannot change `helm-command-prefix-key' once `helm-config' is loaded.
(global-set-key (kbd "C-c h") 'helm-command-prefix)
(global-unset-key (kbd "C-x c"))

;(define-key helm-map (kbd "<tab>") 'helm-execute-persistent-action) ; rebind tab to run persistent action
(define-key helm-map (kbd "C-i") 'helm-execute-persistent-action) ; make TAB works in terminal
(define-key helm-map (kbd "C-z")  'helm-select-action) ; list actions using C-z

(when (executable-find "curl")
  (setq helm-google-suggest-use-curl-p t))


;;; HELM

(global-set-key (kbd "M-x") 'helm-M-x)
(setq helm-M-x-fuzzy-match t) ;; optional fuzzy matching for helm-M-x

(global-set-key (kbd "M-y") 'helm-show-kill-ring)

(global-set-key (kbd "C-x b") 'helm-mini)
(setq helm-buffers-fuzzy-matching t)

(global-set-key (kbd "C-x C-f") 'helm-find-files)

; return in find-files
(defun fu/helm-find-files-navigate-forward (orig-fun &rest args)
  (if (file-directory-p (helm-get-selection))
      (apply orig-fun args)
    (helm-maybe-exit-minibuffer)))
(advice-add 'helm-execute-persistent-action :around #'fu/helm-find-files-navigate-forward)
(define-key helm-find-files-map (kbd "C-o") 'helm-execute-persistent-action)
; optimize backspase
(defun fu/helm-find-files-navigate-back (orig-fun &rest args)
  (if (= (length helm-pattern) (length (helm-find-files-initial-input)))
      (helm-find-files-up-one-level 1)
    (apply orig-fun args)))
(advice-add 'helm-ff-delete-char-backward :around #'fu/helm-find-files-navigate-back)

;;; END HELM
