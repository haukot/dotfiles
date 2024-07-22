;;; ui.el ---                                        -*- lexical-binding: t; -*-

(custom-set-faces
  '(region ((t (:extend t :background "salmon" :distant-foreground "gtk_selection_fg_color")))))

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
