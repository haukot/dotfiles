(require 'dired)
(require 'helm)
(require 'helm-config)
(ido-mode 0)
(ido-mode nil)
(helm-mode 1)
(helm-mode nil)

(setq helm-buffer-max-length 50)
(setq helm-ag-insert-at-point 'symbol)
;;(setq helm-buffer-details-flag nil)


;; The default "C-x c" is quite close to "C-x C-c", which quits Emacs.
;; Changed to "C-c h". Note: We must set "C-c h" globally, because we
;; cannot change `helm-command-prefix-key' once `helm-config' is loaded.
(global-set-key (kbd "C-c h") 'helm-command-prefix)
(global-unset-key (kbd "C-x c"))

;(define-key helm-map (kbd "<tab>") 'helm-execute-persistent-action) ; rebind tab to run persistent action
(define-key helm-map (kbd "C-i") 'helm-execute-persistent-action) ; make TAB works in terminal
(define-key helm-map (kbd "C-z")  'helm-select-action) ; list actions using C-z

;; (when (executable-find "curl")
;;   (setq helm-google-suggest-use-curl-p t))


(global-set-key (kbd "M-x") 'helm-M-x)
;(setq helm-M-x-fuzzy-match t) ;; optional fuzzy matching for helm-M-x

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

;;(define-key helm-find-files-map (kbd "/") 'helm-execute-persistent-action)
(define-key helm-find-files-map (kbd "C-e") 'helm-execute-persistent-action)
; optimize backspase
(defun fu/helm-find-files-navigate-back (orig-fun &rest args)
  (if (= (length helm-pattern) (length (helm-find-files-initial-input)))
      (helm-find-files-up-one-level 1)
    (apply orig-fun args)))
(advice-add 'helm-ff-delete-char-backward :around #'fu/helm-find-files-navigate-back)


;; Эту строку я удалил в elpa в helm-buffers, т.к. с ней после долгой работы C-x b (helm-mini) начинал сильно лагать
;; https://github.com/emacs-helm/helm/blob/9b13fc0e3112d17b2d6dca8e920630c68d064b55/helm-buffers.el#L445

(defun helm-buffers-sort-transformer@donot-sort (_ candidates _)
  candidates)
(advice-add 'helm-buffers-sort-transformer :around 'helm-buffers-sort-transformer@donot-sort)
