(require 'projectile)
(projectile-global-mode)
(projectile-global-mode +1)

;; RAILS
;(add-hook 'ruby-mode-hook 'projectile-rails-mode)
(add-hook 'projectile-mode-hook 'projectile-rails-on)
(setq projectile-rails-expand-snippet nil)

;; HELM integration
(require 'helm-projectile)
(helm-projectile-on)
(setq projectile-completion-system 'helm-comp-read)
