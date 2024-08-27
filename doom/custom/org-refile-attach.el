;;; org-refile-attach.el --- Move attachments on org refile -*- lexical-binding: t; -*-
;; Copyright (C) 2024  J.D. Smith
;;; Commentary:
;; org-refile-attach enables moving attachments associated with a
;; given heading and sub-headings upon refiling it.
;;  XXX: This a proof of concept, and does not handle moving arbitrary
;;       sub-trees or regions correctly
;;; Code:
(require 'org-attach)
(require 'org-element)
(require 'org-roam)

;; Based on https://gist.github.com/jdtsmith/cb2b94101fd452c4ba6b647531aa5b3d
;; for org files

(defun org-refile-attach--in-heading (files)
  "Return those FILES attached within heading at point."
  (let* ((elem (org-element-at-point))
	 (end (org-element-property :contents-end elem))
	 (ret '()))
    (when end
      (save-excursion
	(while (re-search-forward
		(rx "[[attachment:" (group (+ (not ?\]))) "]]") end t)
	  (when (member (match-string 1) files)
	    (cl-pushnew (match-string 1) ret :test #'equal)))))
    ret))

(defun org-refile-attach--move (orig-dir)
  "Move files in directory ORIG-DIR to new attachment location.
To be set on `org-after-refile-insert-hook'."
  (lambda (&rest _)
    (let* ((file-exists (file-exists-p orig-dir))
           (all-files (when file-exists (org-attach-file-list orig-dir)))
           (files (when all-files (org-refile-attach--in-heading all-files)))
           (new-dir (org-attach-dir nil 'no-check))
           (dirs-different (and new-dir (not (string= orig-dir new-dir))))
           (prompt (format "%d attachment%s found.  Move? "
                           (length files)
                           (if (> (length files) 1) "s" "")))
           (user-confirmed (when (and files dirs-different)
                             (y-or-n-p prompt))))
      (when user-confirmed
        (setq new-dir (file-name-as-directory (org-attach-dir-get-create)))
        (condition-case err
            (dolist (f files)
              (let ((src (expand-file-name f orig-dir)))
                (rename-file src new-dir 1)))
          (error (message "Error moving attachment%s: %s"
                          (if (> (length files) 1) "s" "") err))
          (:success
           (delete-directory orig-dir t t)))))))

(defun org-roam-refile-attach-reattach (&optional arg &rest r)
  "Refile heading at point and move any attachments."
  (interactive "P")
  (let* ((orig-dir (org-attach-dir))
         (hook (org-refile-attach--move orig-dir)))
    (unwind-protect
        (progn
          (advice-add 'org-paste-subtree :after hook)
          (org-roam-refile))
      (advice-remove 'org-paste-subtree hook))))

(provide 'org-refile-attach)
;;; org-refile-attach.el ends here
