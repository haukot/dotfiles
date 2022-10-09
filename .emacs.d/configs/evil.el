(require 'evil-snipe)

(evil-snipe-mode +1)
(evil-snipe-override-mode +1)

(global-undo-tree-mode)
(evil-set-undo-system 'undo-tree)
