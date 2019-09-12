(setq gofmt-command "goimports")
(add-hook 'go-mode-hook
           (lambda ()
             (add-hook 'before-save-hook 'gofmt-before-save)))
