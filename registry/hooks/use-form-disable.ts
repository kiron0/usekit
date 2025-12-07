import * as React from "react"

interface UseFormState {
  isSubmitting?: boolean
  isValidating?: boolean
  isSubmitSuccessful?: boolean
}

interface Options {
  isSubmitting?: boolean
  formState?: UseFormState
}

interface Return {
  disabled: boolean
}

export function useFormDisable(options: Options = {}): Return {
  const { isSubmitting, formState } = options

  const formStateIsSubmitting = formState?.isSubmitting
  const formStateIsValidating = formState?.isValidating

  const disabled = React.useMemo(() => {
    if (isSubmitting !== undefined) {
      return isSubmitting
    }
    if (formState) {
      return formStateIsSubmitting === true || formStateIsValidating === true
    }
    return false
  }, [isSubmitting, formStateIsSubmitting, formStateIsValidating, formState])

  return { disabled }
}
