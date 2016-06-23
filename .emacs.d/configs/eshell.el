;; shortener prompt
(defun shortened-path (path max-len)
  "Return a potentially trimmed-down version of the directory PATH"
  (let* ((components (split-string (abbreviate-file-name path) "/"))
         (len (+ (1- (length components))
                 (reduce '+ components :key 'length)))
         (str ""))
    (while (cdr components)
      (setq str (concat str
                        (cond ((= 0 (length (car components))) "/")
                              ((> 3 (length (car components)))
                               (concat (car components) "/"))
                              (t
                               (if (string= "."
                                            (substring (car components) 0 1))
                                   (concat (substring (car components) 0 2)
                                           "/")
                                 (concat (substring (car components) 0 3) "/")))))
            len (- len (1- (length (car components))))
            components (cdr components)))
    (concat str (reduce (lambda (a b) (concat a "/" b)) components))))

(defun rjs-eshell-prompt-function ()
  (concat (shortened-path (eshell/pwd) 40)
          (if (= (user-uid) 0) " # " " $ ")))

(setq eshell-prompt-function 'rjs-eshell-prompt-function)
(setq eshell-highlight-prompt nil)

;; for ansi-term
(add-hook 'term-mode-hook (lambda()
        (setq yas-dont-activate t)))
(add-hook 'term-mode-hook (lambda () (yas-minor-mode -1)))
