(evil-collection-init 'vterm)

;; ----- Разные вариации для работы evil в vterm

;; (evil-define-key 'normal vterm-mode-map "db" 'vterm-send-C-w)
;; (evil-define-key 'normal vterm-mode-map "de" 'vterm-send-M-d)
;; (evil-define-key 'normal vterm-mode-map "p" 'vterm-yank)
;; (evil-define-key 'normal vterm-mode-map "P" '(lambda ()
;;                                                (interactive)
;;                                                (vterm-send-C-b)
;;                                                (vterm-yank)))
;; (evil-define-key 'visual vterm-mode-map "d" 'vterm-send-M-w)

;; -----

;; https://github.com/akermu/emacs-libvterm/issues/313#issuecomment-683231591

;; -----

;; (defun vterm-evil-insert ()
;;   (interactive)
;;   (vterm-goto-char (point))
;;   (call-interactively #'evil-insert))

;; (defun vterm-evil-append ()
;;   (interactive)
;;   (vterm-goto-char (1+ (point)))
;;   (call-interactively #'evil-append))

;; (defun vterm-evil-delete ()
;;   "Provide similar behavior as `evil-delete'."
;;   (interactive)
;;   (let ((inhibit-read-only t)
;;         )
;;     (cl-letf (((symbol-function #'delete-region) #'vterm-delete-region))
;;       (call-interactively 'evil-delete))))

;; (defun vterm-evil-change ()
;;   "Provide similar behavior as `evil-change'."
;;   (interactive)
;;   (let ((inhibit-read-only t))
;;     (cl-letf (((symbol-function #'delete-region) #'vterm-delete-region))
;;       (call-interactively 'evil-change))))

;; (defun my-vterm-hook()
;;   (evil-local-mode 1)
;;   (evil-define-key 'normal 'local "a" 'vterm-evil-append)
;;   (evil-define-key 'normal 'local "d" 'vterm-evil-delete)
;;   (evil-define-key 'normal 'local "i" 'vterm-evil-insert)
;;   (evil-define-key 'normal 'local "c" 'vterm-evil-change))

;; (add-hook 'vterm-mode-hook 'my-vterm-hook)
