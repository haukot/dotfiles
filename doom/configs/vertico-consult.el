;;; vertico-consult.el ---                           -*- lexical-binding: t; -*-

;; Vertico
;; TODO: имеет смысл только если vertico снизу в минибуффере показывать? Иначе все
;; равно нормально не видно
;;
;; (when (modulep! :completion vertico)
;;   (after! consult
;;           (setq consult--customize-alist nil)
;;     (consult-customize
;;             :preview-key '(:debounce 0.4 any))))



;; Vertico - сортировка поиска в файлах по алфавиту, а остальное по частоте и алфавиту
;; дефолтная функция - vertico-sort-history-length-alpha (https://github.com/minad/vertico/blob/main/vertico.el#L94C36-L94C69)
;; Сортировку через ripgrep использовать не можем т.к. тогда он будет не parallel (она была бы к параметрам consult)
(defun my-custom-vertico-sort (candidates)
  "Custom sort function for Vertico candidates."
  (sort candidates #'string-lessp))
(defun my-advice-for-custom-sort (orig-fn &rest args)
  "Advice to set custom vertico sort function temporarily."
  (let ((vertico-sort-function #'my-custom-vertico-sort))
    (apply orig-fn args)))
(advice-add '+default/search-project-for-symbol-at-point :around #'my-advice-for-custom-sort)
(advice-add '+default/search-project :around #'my-advice-for-custom-sort)

(after! consult
        ;; Отключаем группирование по названию файла в поиске по проекту
        ;; т.к. занимает много места
        (consult-customize
                +default/search-project-for-symbol-at-point
                +default/search-project
                :group nil
                :sort t)

        ;; тут отключаем group т.к. ломает сортировку
        ;;  sort nil включает дефолтную сортировку емакса по времени открытия
        (consult-customize consult-buffer :group nil :sort nil)


        ;;   ;; ;; Include current buffer
        ;;   ;; (setq consult-buffer-sources
        ;;   ;;       (cons 'consult--source-buffer
        ;;   ;;             (delq 'consult--source-buffer consult-buffer-sources)))
        )


;; make pgdown pgup working
(after! vertico
  (define-key vertico-map (kbd "<prior>") #'vertico-scroll-down)
  (define-key vertico-map (kbd "<next>") #'vertico-scroll-up))
