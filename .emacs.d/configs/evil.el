(require 'evil-snipe)

(evil-snipe-mode +1)
(evil-snipe-override-mode +1)

;; https://github.com/casouri/vundo, undo-fu, undo-fu-session - замены для undo-tree
(global-undo-tree-mode)
(evil-set-undo-system 'undo-tree)
