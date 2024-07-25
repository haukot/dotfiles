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

(after! consult
        ;; Отключаем группирование по названию файла в поиске по проекту
        ;; т.к. занимает много места
        (consult-customize
                +default/search-project-for-symbol-at-point
                +default/search-project
                ;; consult-buffer ; тут отключаем group т.к. ломает сортировку
                :group nil :sort t)

        ;; тут отключаем group т.к. ломает сортировку
        ;;  sort nil включает дефолтную сортировку емакса по времени открытия
        (consult-customize consult-buffer :group nil :sort nil)


        ;;   ;; ;; Include current buffer
        ;;   ;; (setq consult-buffer-sources
        ;;   ;;       (cons 'consult--source-buffer
        ;;   ;;             (delq 'consult--source-buffer consult-buffer-sources)))
        )
