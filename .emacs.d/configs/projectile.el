(require 'projectile)
(projectile-global-mode)
(projectile-global-mode +1)
(projectile-mode +1)

(define-key projectile-mode-map (kbd "C-c p") 'projectile-command-map)

;; RAILS
;(projectile-rails-global-mode)
;(add-hook 'ruby-mode-hook 'projectile-rails-mode)
(projectile-rails-global-mode)
(add-hook 'projectile-mode-hook 'projectile-rails-on)
(define-key projectile-rails-mode-map (kbd "C-c r") 'projectile-rails-command-map)
(setq projectile-rails-expand-snippet nil)

;; HELM integration
(require 'helm-projectile)
(helm-projectile-on)
(setq projectile-completion-system 'helm-comp-read)
