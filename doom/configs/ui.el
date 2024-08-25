;;; ui.el ---                                        -*- lexical-binding: t; -*-

(custom-set-faces
  '(region ((t (:extend t :background "salmon" :distant-foreground "gtk_selection_fg_color")))))

(custom-set-faces! '(cursor :background "wheat4"))
(setq evil-normal-state-cursor '("wheat4" box))
(setq evil-insert-state-cursor '("wheat4" bar))
(setq evil-visual-state-cursor '("wheat4" hollow))
(setq evil-operator-state-cursor '("wheat4" (hbar . 10)))

(custom-theme-set-faces! 'user
  `(default :background "wheat")
  `(window-divider :foreground "grey")
  `(fringe :background "wheat1")
  `(line-number :background "wheat1" :foreground "grey50")
  `(line-number-current-line :background "wheat2" :foreground "grey30" :weight bold)
  `(mode-line :background "wheat1" :foreground "black" :box nil)
  `(mode-line-inactive :background "wheat3" :foreground "gray50" :box nil)
  `(cursor :background "wheat4"))
        ;; ;; (set-background-color "ivory")
        ;; ;; (set-background-color "khaki")
        ;; ;; (set-background-color "pink")
        ;; (set-background-color "wheat")
        ;; (custom-set-faces '(window-divider ((t (:foreground "grey")))))
        ;; (custom-set-faces '(fringe ((t (:background "wheat1")))))
        ;; (custom-set-faces '(top-bar ((t (:background "wheat1")))))

        ;; ;; Set the color for the mode line
        ;; (set-face-attribute 'mode-line nil :background "wheat1" :foreground "black" :box nil)
        ;; (set-face-attribute 'mode-line-inactive nil :background "wheat3" :foreground "gray50" :box nil)
        ;; ;; colors for line numbers
        ;; ;; (custom-set-faces '(line-number ((t (:background "wheat" :foreground "grey50")))))
        ;; )

;; Pdf pages in modeline
(setq +modeline-pdf-page nil)

(defun +modeline-update-pdf-pages ()
  "Update PDF pages."
  (setq +modeline-pdf-page
        (format "  P%d/%d "
                (eval `(pdf-view-current-page))
                (pdf-cache-number-of-pages))))
(add-hook 'pdf-view-change-page-hook #'+modeline-update-pdf-pages)

;;; Modeline
(setq-default mode-line-format
  (list
    ;; Left-aligned section
    '(:eval (evil-state-property evil-state :tag t))
    '(:eval
       (let* ((file-name (buffer-file-name))
              (display-name (if file-name
                                (let ((project-root (projectile-project-root)))
                                  (if project-root
                                      (file-relative-name file-name project-root)
                                    (abbreviate-file-name file-name)))
                              (buffer-name))))
         (propertize display-name
                     'face '(:foreground "brown4" :weight bold)
                     'help-echo (or file-name "Buffer has no file name"))))
    '(:eval (propertize (if +modeline-pdf-page +modeline-pdf-page "")))
    " "
    ;; Right-aligned section that includes project name, major mode, and line:col
    '(:eval
       (let* ((line-col (format-mode-line "%l:%c"))
              (my-project-name (if (projectile-project-p)
                                   (projectile-project-name)
                                 ""))
              (my-mode-name (format-mode-line mode-name))
              (space-width (+ 5
                              (string-width my-project-name)
                              (string-width my-mode-name)
                              (string-width line-col))))
         (list
          (propertize " " 'display `((space :align-to (- right ,space-width))))
          (propertize (concat " " my-project-name " "))
          (propertize (concat my-mode-name " ") 'face 'font-lock-string-face)
          (propertize (concat line-col " ") 'face 'font-lock-constant-face)))))
  )

;;; Topbar
(after! frame
  (setq frame-title-format
    '((:eval (if (buffer-file-name)
               (concat (abbreviate-file-name (buffer-file-name)) " - Doom Emacs")
               (concat "%b - Doom Emacs"))))))


;;; Centaur Tabs
(after! centaur-tabs
        (custom-set-faces
                '(centaur-tabs-default ((t (:inherit nil :background "wheat3" :foreground "black"))))
                '(centaur-tabs-selected ((t (:background "wheat1" :foreground "#000000"))))
                '(centaur-tabs-unselected ((t (:background "#e0e0e0" :foreground "#707070"))))
                '(centaur-tabs-selected-modified ((t (:background "wheat1" :foreground "brown"))))
                '(centaur-tabs-unselected-modified ((t (:background "wheat1" :foreground "brown"))))
                '(centaur-tabs-active-bar-face ((t (:background "wheat1" :height 2))))
                '(centaur-tabs-modified-marker-selected ((t (:inherit 'centaur-tabs-selected :foreground "brown"))))
                '(centaur-tabs-modified-marker-unselected ((t (:inherit 'centaur-tabs-unselected :foreground "brown"))))
                )
        ;; такой же face на headline как на default
        (centaur-tabs-headline-match)

        ;; Enable keybindings
        (global-set-key (kbd "C-<tab>") 'centaur-tabs-forward)
        (global-set-key (kbd "C-<iso-lefttab>") 'centaur-tabs-backward))

;; because default is https://github.com/doomemacs/doomemacs/blob/f5b3958331cebf66383bf22bdc8b61cd44eca645/modules/config/default/%2Bevil-bindings.el#L333
(map!
        :i "C-<tab>" #'centaur-tabs-forward
        :nv "C-<tab>" #'centaur-tabs-forward
        "C-<tab>" #'centaur-tabs-forward
        "C-<tab>" #'centaur-tabs-forward)
