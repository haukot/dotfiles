;; (after! ruby-mode
;;   (setq-local xref-backend-functions nil))

;; (after! ruby-mode
;;   (remove-hook 'xref-backend-functions t))

;; (set-lookup-handlers! 'ruby-mode
;;         :xref-backend nil)

;; (add-hook 'xref-backend-functions #'dumb-jump-xref-activate)

;; (after! dumb-jump
;;  (dumb-jump-selector 'completing-read))
