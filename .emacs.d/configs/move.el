(load-file (expand-file-name "./dead-eye-jump.el"))
(load-file (expand-file-name "./dead-eye-jump-game.el"))
(require 'dead-eye-jump)
(require 'dead-eye-jump-game)
;; (setq debug-on-error t)

;; (setq dead-eye-jump-repeats 4)

;; (setq dead-eye-jump-columns 5)
;; (setq dead-eye-jump-rows 4)
;; (setq dead-eye-jump-keys '("q" "d"      "j" "f" "u"
;;                            "r" "w" "b"  "p" ":"
;;                            "a" "s"      "y" "n" "e"
;;                            "h" "t" "g"  "o" "i"))

;; (setq dead-eye-jump-columns 8)
;; (setq dead-eye-jump-rows 3)
;; (setq dead-eye-jump-keys '(
;;                            "q" "d" "r" "w"  "f" "u" "p" ":"
;;                            "a" "s" "h" "t"  "n" "e" "o" "i"
;;                            "z" "x" "m" "c"  "l" "," "." "/"
;;                            ))

(setq dead-eye-jump-keys '("q" "d"  "f" "u"
                           "r" "w"  "p" ":"
                           "a" "s"  "n" "e"
                           "h" "t"  "o" "i"))
(global-set-key (kbd "C-j") 'dead-eye-jump)
