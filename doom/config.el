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
(setq doom-theme 'doom-one)

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

;; переключения по окнам через Shift-Arrows
(windmove-default-keybindings)

;; Отключение подтверждения о закрытии
(setq confirm-kill-emacs nil)


;; Другой символ для folded в org-mode
(setq org-ellipsis " ▼")
(after! org
  (set-face-attribute 'org-ellipsis nil :foreground "deep sky blue" :underline nil))



;;;
;;;
;;; Org-mode более лучший return
;;;
;;;
;; (defun my-org-return ()
;;   "Custom function for RET in Org mode."
;;   (interactive)
;;   (if (org-at-item-p)
;;       (org-insert-item)
;;     (org-return)))

;; (define-key org-mode-map (kbd "RET") 'my-org-return)
;; (define-key org-mode-map (kbd "C-<return>") 'org-insert-item)


;;; from https://tecosaur.github.io/emacs-config/config.html#nicer-org-return
(defun unpackaged/org-element-descendant-of (type element)
  "Return non-nil if ELEMENT is a descendant of TYPE.
TYPE should be an element type, like `item' or `paragraph'.
ELEMENT should be a list like that returned by `org-element-context'."
  ;; MAYBE: Use `org-element-lineage'.
  (when-let* ((parent (org-element-property :parent element)))
    (or (eq type (car parent))
        (unpackaged/org-element-descendant-of type parent))))

(defun unpackaged/org-return-dwim (&optional default)
  "A helpful replacement for `org-return-indent'.  With prefix, call `org-return-indent'.

On headings, move point to position after entry content.  In
lists, insert a new item or end the list, with checkbox if
appropriate.  In tables, insert a new row or end the table."
  ;; Inspired by John Kitchin: http://kitchingroup.cheme.cmu.edu/blog/2017/04/09/A-better-return-in-org-mode/
  (interactive "P")
  (if default
      (org-return t)
    (cond
     ;; Act depending on context around point.

     ;; NOTE: I prefer RET to not follow links, but by uncommenting this block, links will be
     ;; followed.

     ;; ((eq 'link (car (org-element-context)))
     ;;  ;; Link: Open it.
     ;;  (org-open-at-point-global))

     ((org-at-heading-p)
      ;; Heading: Move to position after entry content.
      ;; NOTE: This is probably the most interesting feature of this function.
      (let ((heading-start (org-entry-beginning-position)))
        (goto-char (org-entry-end-position))
        (cond ((and (org-at-heading-p)
                    (= heading-start (org-entry-beginning-position)))
               ;; Entry ends on its heading; add newline after
               (end-of-line)
               (insert "\n\n"))
              (t
               ;; Entry ends after its heading; back up
               (forward-line -1)
               (end-of-line)
               (when (org-at-heading-p)
                 ;; At the same heading
                 (forward-line)
                 (insert "\n")
                 (forward-line -1))
               (while (not (looking-back "\\(?:[[:blank:]]?\n\\)\\{3\\}" nil))
                 (insert "\n"))
               (forward-line -1)))))

     ((org-at-item-checkbox-p)
      ;; Checkbox: Insert new item with checkbox.
      (org-insert-todo-heading nil))

     ((org-in-item-p)
      ;; Plain list.  Yes, this gets a little complicated...
      (let ((context (org-element-context)))
        (if (or (eq 'plain-list (car context))  ; First item in list
                (and (eq 'item (car context))
                     (not (eq (org-element-property :contents-begin context)
                              (org-element-property :contents-end context))))
                (unpackaged/org-element-descendant-of 'item context))  ; Element in list item, e.g. a link
            ;; Non-empty item: Add new item.
            (org-insert-item)
          ;; Empty item: Close the list.
          ;; TODO: Do this with org functions rather than operating on the text. Can't seem to find the right function.
          (delete-region (line-beginning-position) (line-end-position))
          (insert "\n"))))

     ((when (fboundp 'org-inlinetask-in-task-p)
        (org-inlinetask-in-task-p))
      ;; Inline task: Don't insert a new heading.
      (org-return t))

     ((org-at-table-p)
      (cond ((save-excursion
               (beginning-of-line)
               ;; See `org-table-next-field'.
               (cl-loop with end = (line-end-position)
                        for cell = (org-element-table-cell-parser)
                        always (equal (org-element-property :contents-begin cell)
                                      (org-element-property :contents-end cell))
                        while (re-search-forward "|" end t)))
             ;; Empty row: end the table.
             (delete-region (line-beginning-position) (line-end-position))
             (org-return t))
            (t
             ;; Non-empty row: call `org-return-indent'.
             (org-return t))))
     (t
      ;; All other cases: call `org-return-indent'.
      (org-return t)))))


;;;###autoload
(map!
 :after evil-org
 :map evil-org-mode-map
 :i [return] #'unpackaged/org-return-dwim)





;;;;
;;;;
;;;;  Org-mode flycheck (lint)
;;;;
;;;; Падает почему-то при загрузке емакса
;;;;

;; from https://tecosaur.github.io/emacs-config/config.html#flycheck-with-org
;; (after! flycheck
;;   (defconst flycheck-org-lint-form
;;     (flycheck-prepare-emacs-lisp-form
;;       (require 'org)
;;       (require 'org-lint)
;;       (require 'org-attach)
;;       (let ((source (car command-line-args-left))
;;             (process-default-directory default-directory))
;;         (with-temp-buffer
;;           (insert-file-contents source 'visit)
;;           (setq buffer-file-name source)
;;           (setq default-directory process-default-directory)
;;           (delay-mode-hooks (org-mode))
;;           (setq delayed-mode-hooks nil)
;;           (dolist (err (org-lint))
;;             (let ((inf (cl-second err)))
;;               (princ (elt inf 0))
;;               (princ ": ")
;;               (princ (elt inf 2))
;;               (terpri))))))))
;;
;; (defconst flycheck-org-lint-variables
;;   '(org-directory
;;     org-id-locations
;;     org-id-locations-file
;;     org-attach-id-dir
;;     org-attach-use-inheritance
;;     org-attach-id-to-path-function-list
;;     org-link-parameters)
;;   "Variables inherited by the org-lint subprocess.")
;;
;; (defconst flycheck-org-lint-babel-langs
;;   '<<org-babel-list-langs()>>
;;   "Languages that org-babel should know of.")
;;
;; (defun flycheck-org-lint-variables-form ()
;;   (require 'org-attach)  ; Needed to make variables available
;;   `(progn
;;      ,@(seq-map (lambda (opt) `(setq-default ,opt ',(symbol-value opt)))
;;                 (seq-filter #'boundp flycheck-org-lint-variables))))
;;
;; (defun flycheck-org-lint-babel-langs-form ()
;;   `(progn
;;      ,@(mapcar
;;         (lambda (lang)
;;           `(defun ,(intern (format "org-babel-execute:%s" lang)) (_body _params)
;;              "Stub for org-lint."))
;;         flycheck-org-lint-babel-langs)))
;;
;; (eval ; To preveant eager macro expansion form loading flycheck early.
;;  '(flycheck-define-checker org-lint
;;     "Org buffer checker using `org-lint'."
;;     :command ("emacs" (eval flycheck-emacs-args)
;;               "--eval" (eval (concat "(add-to-list 'load-path \""
;;                                      (file-name-directory (locate-library "org"))
;;                                      "\")"))
;;               "--eval" (eval (flycheck-sexp-to-string
;;                               (flycheck-org-lint-variables-form)))
;;               "--eval" (eval (flycheck-sexp-to-string
;;                               (flycheck-org-lint-customisations-form)))
;;               "--eval" (eval (flycheck-sexp-to-string
;;                               (flycheck-org-lint-babel-langs-form)))
;;               "--eval" (eval flycheck-org-lint-form)
;;               "--" source)
;;     :error-patterns
;;     ((error line-start line ": " (message) line-end))
;;     :modes org-mode))
;;
;; (add-to-list 'flycheck-checkers 'org-lint)

;;;
;;;
;;; Org-Roam
;;;
;;;

;; create dir
;; (make-directory "/media/data/ObsidianNotesVault/NewVault/org/roam")
(setq org-directory "/media/data/ObsidianNotesVault/NewVault/org")
(setq org-roam-directory (file-truename "/media/data/ObsidianNotesVault/NewVault/org"))


;;;
;;; Git autocommit
;;;
;;;
(setq gac-automatically-push-p t)
(setq gac-automatically-add-new-files-p t)
(setq gac-debounce-interval 1)
(setq gac-default-message "Auto-commit: %F %T")

(add-hook 'org-mode-hook 'git-auto-commit-mode)

(add-load-path! (expand-file-name "configs/copilot.el"))


;;; Отлючаем автокомментарии, т.к. по+default-want-RET-continue-commentsка только бесят
;;; Оставляем по return
;; (setq +default-want-RET-continue-comments nil)
(setq +evil-want-o/O-to-continue-comments nil)
