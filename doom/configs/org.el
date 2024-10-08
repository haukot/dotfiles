;;; configs/org.el -*- lexical-binding: t; -*-
(setq org-catch-invisible-edits 'smart)
(setq org-ctrl-k-protect-subtree t)

;; Другой символ для folded в org-mode
(setq org-ellipsis " ▼")
(after! org
        (set-face-attribute 'org-ellipsis nil :foreground "sky blue" :underline nil)
        (set-face-attribute 'org-drawer nil :inherit 'default :foreground "grey54" :background nil :weight 'normal :slant 'normal)

        ;; (custom-set-faces
        ;;         '(org-level-2 ((t 'font-lock-comment-face))))

        ;; (set-face-attribute 'org-special-keyword nil
        ;;         :foreground "blue"        ;; Example: Set the text color to blue
        ;;         :background "white"       ;; Example: Set background color to black
        ;;         :weight 'bold             ;; Example: Make the font bold
        ;;         :underline t)
        )


(defun haukot/org-capture-project-notes ()
  (interactive)
  (org-capture nil "pn"))
;; SPC n p - project notes
(map! :leader "n p" #'haukot/org-capture-project-notes)
;; SPC n d - daily notes
(map! :leader "n d" #'org-roam-dailies-capture-today)
;; SPC n n n - inbox notes


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
(setq org-directory "/media/data/ObsidianNotesVault/NewVault/org/")
(setq org-roam-directory (file-truename "/media/data/ObsidianNotesVault/NewVault/org/roam/"))


;;;
;;; Git autocommit
;;;
;;;
(setq gac-automatically-push-p t)
(setq gac-automatically-add-new-files-p t)
(setq gac-debounce-interval 1)

(add-hook 'org-mode-hook 'git-auto-commit-mode)


  ;; (defun org-capture-inbox ()
  ;;   (interactive)
  ;;   (call-interactively 'org-store-link)
  ;;   (org-capture nil "i"))
  ;; (define-key global-map (kbd "C-c i") 'org-capture-inbox)

;; (define-key global-map (kbd ))
;; (after! org
;;   (add-to-list 'org-capture-templates** [ ]

;;                '("nt" "Todo" entry (file my-org-tasks-file)
;;                   "* TODO %?\n  %i\n  %a"))


;; Чтобы org-goto можно было удобно пользоваться(из https://www.n16f.net/blog/org-mode-headline-tips/)
(setq org-goto-interface 'outline-path-completion)
(setq org-outline-path-complete-in-steps nil)
(setq org-goto-max-level 2)

;; В org-buffer чтобы можно было кликать мышкой(по умолчанию RET)
(after! org
        (define-key org-roam-mode-map [mouse-1] #'org-roam-preview-visit))

;; Прячем :PROPERTIES:
;; org-tidy-untidy-buffer for one, org-tidy-toggle for all
(use-package org-tidy
  :ensure t
  :hook
  (org-mode . org-tidy-mode))


(after! org
        ;; то что должно показываться в org-roam buffer (https://github.com/org-roam/org-roam/blob/main/doc/org-roam.org#configuring-what-is-displayed-in-the-buffer)
        (setq org-roam-mode-sections
                (list #'org-roam-backlinks-insert-section
                        #'org-roam-reflinks-insert-section
                        #'org-roam-unlinked-references-insert-section))
        )


;; Tags
(setq org-tag-alist '(
                             ("почитать" . ?r)
                            ("посмотреть" . ?n)
                             ("org" . ?o)
                             ("emacs" . ?e)
                             ("programming" . ?p)
                             ("собеседования" . ?c)
                             ("резюме" . nil)
                             ))
;; ;; Tag colors
;; (setq org-tag-faces
;;       '(
;;         ("meeting"   . (:foreground "yellow1"       :weight bold))
;;         )
;;       )


;; Org-protocol for browser extension https://github.com/sprig/org-capture-extension
; чтобы не падало когда линки с []
(defun transform-square-brackets-to-round-ones(string-to-transform)
  "Transforms ?[ into ( and ?] into ), other chars left unchanged."
        (concat
                (mapcar #'(lambda (c) (if (equal c ?[) ?\( (if (equal c ?]) ?\) c))) string-to-transform))
        )
;; p - если что-то выделено для страницы, L - если нет
(after! org-protocol
        (add-to-list 'org-capture-templates '("p" "Protocol Content" entry (file+headline +org-capture-notes-file "Inbox")
                                                     "* %u %^{Title}\n[[%:link][%:link]](%(transform-square-brackets-to-round-ones \"%:description\")) \n #+BEGIN_QUOTE\n%i\n#+END_QUOTE\n\n\n%?" :prepend t))
        (add-to-list 'org-capture-templates '("L" "Protocol Link" entry (file+headline +org-capture-notes-file "Inbox")
                                                     "* %u %? [[%:link][%:link]](%(transform-square-brackets-to-round-ones \"%:description\"))\n" :prepend t)
                ))
