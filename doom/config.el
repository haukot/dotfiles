;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets. It is optional.
;; (setq user-full-name "John Doe"
;;       user-mail-address "john@doe.com")

;; Doom exposes five (optional) variables for controlling fonts in Doom:
;;
;; - `doom-font' -- the primary font to use
;; - `doom-variable-pitch-font' -- a non-monospace font (where applicable)
;; - `doom-big-font' -- used for `doom-big-font-mode'; use this for
;;   presentations or streaming.
;; - `doom-symbol-font' -- for symbols
;; - `doom-serif-font' -- for the `fixed-pitch-serif' face
;;
;; See 'C-h v doom-font' for documentation and more examples of what they
;; accept. For example:
;;
;;(setq doom-font (font-spec :family "Fira Code" :size 12 :weight 'semi-light)
;;      doom-variable-pitch-font (font-spec :family "Fira Sans" :size 13))
;;
(setq doom-font "DejaVu Sans Mono-12")
;;
;; If you or Emacs can't find your font, use 'M-x describe-font' to look them
;; up, `M-x eval-region' to execute elisp code, and 'M-x doom/reload-font' to
;; refresh your font settings. If Emacs still can't find your font, it likely
;; wasn't installed correctly. Font issues are rarely Doom issues!

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set `doom-theme' or manually load a theme with the
;; `load-theme' function. This is the default:

;; load default emacs theme (default doom theme is 'doom-one)

(setq doom-theme nil)




;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type t)


;; Whenever you reconfigure a package, make sure to wrap your config in an
;; `after!' block, otherwise Doom's defaults may override your settings. E.g.
;;
;;   (after! PACKAGE
;;     (setq x y))
;;
;; The exceptions to this rule:
;;
;;   - Setting file/directory variables (like `org-directory')
;;   - Setting variables which explicitly tell you to set them before their
;;     package is loaded (see 'C-h v VARIABLE' to look up their documentation).
;;   - Setting doom variables (which start with 'doom-' or '+').
;;
;; Here are some additional functions/macros that will help you configure Doom.
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;; Alternatively, use `C-h o' to look up a symbol (functions, variables, faces,
;; etc).
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.


;; (add-hook 'vue-mode-hook #'lsp!)
;; npm install -g vue-language-server
;; doom refresh


(defun load-user-file (file)
  (interactive "f")
  "Load a file in current user's configuration directory"
  (load-file (expand-file-name file "~/.config/doom/configs")))

(load-user-file "all.el")
(load-user-file "copilot.el")
(load-user-file "org.el")
(load-user-file "ui.el")


;; переключения по окнам через Shift-Arrows
(windmove-default-keybindings)

;; Отключение подтверждения о закрытии
(setq confirm-kill-emacs nil)

;;; Отлючаем автокомментарии, т.к. по+default-want-RET-continue-commentsка только бесят
;;; Оставляем по return
;; (setq +default-want-RET-continue-comments nil)
(setq +evil-want-o/O-to-continue-comments nil)

(map! "C-c p f" #'projectile-find-file)

(setq persp-keymap-prefix  (kbd "C-c p p"))
(map! "C-c p s" #'+default/search-project-for-symbol-at-point);#'+default/search-project)

(map! :map vertico-map
      :after vertico
      :desc "Go do current" "C-e" #'vertico-insert
      :desc "Directory up" "C-l" #'vertico-directory-up)

;; disable custom C-x ... in insert mode https://github.com/doomemacs/doomemacs/blob/f5b3958331cebf66383bf22bdc8b61cd44eca645/modules/editor/evil/config.el#L580
(after! evil
        (map! (:prefix "C-x"
                      :i "C-l" nil
                      :i "C-k" nil
                      :i "C-f" nil
                      :i "C-]" nil
                      :i "s"   nil
                      :i "C-s" nil
                      :i "C-o" nil
                      :i "C-n" nil
                      :i "C-p" nil)))

(global-set-key (kbd "C-x C-r") 'rename-visited-file)
