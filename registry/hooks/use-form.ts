import * as React from "react"

export type FormErrors<T> = Partial<Record<keyof T, string>>
export type FormTouched<T> = Partial<Record<keyof T, boolean>>

interface Options<T> {
  initialValues: T
  validate?: (values: T) => FormErrors<T>
  onSubmit?: (values: T) => void | Promise<void>
}

interface Return<T> {
  values: T
  errors: FormErrors<T>
  touched: FormTouched<T>
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  setFieldError: (field: keyof T, error: string | undefined) => void
  resetForm: () => void
  isSubmitting: boolean
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: Options<T>): Return<T> {
  const [values, setValues] = React.useState<T>(initialValues)
  const [errors, setErrors] = React.useState<FormErrors<T>>({})
  const [touched, setTouched] = React.useState<FormTouched<T>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
      setTouched((prev) => ({ ...prev, [name]: true }))
    },
    []
  )

  const handleBlur = React.useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))
      if (validate) {
        const newErrors = validate({ ...values, [name]: e.target.value })
        setErrors((prev) => ({ ...prev, ...newErrors }))
      }
    },
    [values, validate]
  )

  const setFieldValue = React.useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => ({ ...prev, [field]: true }))
    },
    []
  )

  const setFieldError = React.useCallback(
    (field: keyof T, error: string | undefined) => {
      setErrors((prev) => ({ ...prev, [field]: error }))
    },
    []
  )

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)
      const validationErrors = validate ? validate(values) : {}
      setErrors(validationErrors)
      setTouched(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      )

      if (Object.keys(validationErrors).length === 0 && onSubmit) {
        try {
          await onSubmit(values)
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }
      setIsSubmitting(false)
    },
    [values, validate, onSubmit]
  )

  const resetForm = React.useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return React.useMemo(
    () => ({
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldError,
      resetForm,
      isSubmitting,
    }),
    [
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldError,
      resetForm,
      isSubmitting,
    ]
  )
}
