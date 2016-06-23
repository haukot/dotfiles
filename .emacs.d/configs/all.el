(global-set-key (kbd "C-s") 'isearch-forward-regexp)
(global-set-key (kbd "C-r") 'isearch-backward-regexp)
(global-set-key (kbd "C-M-s") 'isearch-forward)
(global-set-key (kbd "C-M-r") 'isearch-backward)

(global-set-key (kbd "C-c i") 'imenu)

;;; ---------------------------------------------------------------------------
;;; Requires
;;; ---------------------------------------------------------------------------

(require 'flymake)
(require 'flycheck) ;; http://www.flycheck.org/manual/latest/index.html
(require 'evil)
(require 'powerline)
(require 'powerline-evil-theme)
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
(yas-minor-mode 1)
(yas-minor-mode-on)


;;(global-whitespace-mode)

;;; rainbow-delimiters

(require 'rainbow-delimiters)
(rainbow-delimiters-mode 1)
(add-hook 'prog-mode-hook #'rainbow-delimiters-mode)

;;;

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

(require 'less-css-mode)
(add-to-list 'auto-mode-alist '("\\.scss?$" . less-css-mode))

(add-hook 'before-save-hook 'delete-trailing-whitespace)


(setq ido-use-filename-at-point nil)
;; (put ffap-machine-p-known 'reject) what this?

;;;; flx
(require 'flx-ido)
(ido-mode 1)
(ido-everywhere 1)
(flx-ido-mode 1)
;; disable ido faces to see flx highlights.
(setq ido-enable-flex-matching t)
(setq ido-use-faces nil)
;;;; end flx

;; (electric-pair-mode t)

(global-linum-mode)

;; rename current open file
(setq-default indent-tabs-mode nil)
(defun rename-current-buffer-file ()
  "Renames current buffer and file it is visiting."
  (interactive)
  (let ((name (buffer-name))
        (filename (buffer-file-name)))
    (if (not (and filename (file-exists-p filename)))
        (error "Buffer '%s' is not visiting a file!" name)
      (let ((new-name (read-file-name "New name: " filename)))
        (if (get-buffer new-name)
            (error "A buffer named '%s' already exists!" new-name)
          (rename-file filename new-name 1)
          (rename-buffer new-name)
          (set-visited-file-name new-name)
          (set-buffer-modified-p nil)
          (message "File '%s' successfully renamed to '%s'"
                   name (file-name-nondirectory new-name)))))))

(global-set-key (kbd "C-x C-r") 'rename-current-buffer-file)

(require 'evil-surround)
(global-evil-surround-mode 1)

(require 'evil-commentary)
(evil-commentary-mode)

(require 'evil-matchit)
(global-evil-matchit-mode 1)


(add-hook 'markdown-mode-hook
           (lambda ()
             (visual-line-mode)
             )
           )
