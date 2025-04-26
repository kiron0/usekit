import * as React from "react"

interface Actions {
  goToNextStep: () => void
  goToPrevStep: () => void
  reset: () => void
  canGoToNextStep: boolean
  canGoToPrevStep: boolean
  setStep: React.Dispatch<React.SetStateAction<number>>
}

type SetStepCallbackType = (step: number | ((step: number) => number)) => void

export function useStep(maxStep: number): [number, Actions] {
  const [currentStep, setCurrentStep] = React.useState(1)

  const canGoToNextStep = currentStep + 1 <= maxStep
  const canGoToPrevStep = currentStep - 1 > 0

  const setStep = React.useCallback<SetStepCallbackType>(
    (step) => {
      const newStep = step instanceof Function ? step(currentStep) : step

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep)
        return
      }

      throw new Error("Step not valid")
    },
    [maxStep, currentStep]
  )

  const goToNextStep = React.useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep((step) => step + 1)
    }
  }, [canGoToNextStep])

  const goToPrevStep = React.useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep((step) => step - 1)
    }
  }, [canGoToPrevStep])

  const reset = React.useCallback(() => {
    setCurrentStep(1)
  }, [])

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ]
}
