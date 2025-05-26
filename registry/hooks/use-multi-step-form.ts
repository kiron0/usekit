import * as React from "react"

interface Options {
  initialStep?: number
  totalSteps: number
  onStepChange?: (currentStep: number) => void
  allowLooping?: boolean
}

interface Controls {
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  next: () => void
  previous: () => void
  goTo: (step: number) => void
  progress: number
  canGoNext: boolean
  canGoPrevious: boolean
}

export function useMultiStepForm({
  initialStep = 0,
  totalSteps,
  onStepChange,
  allowLooping = false,
}: Options): Controls {
  const [currentStep, setCurrentStep] = React.useState(() =>
    Math.min(Math.max(initialStep, 0), totalSteps - 1)
  )

  const safeSetCurrentStep = React.useCallback(
    (newStep: number) => {
      const clampedStep = Math.min(Math.max(newStep, 0), totalSteps - 1)
      setCurrentStep(clampedStep)
      onStepChange?.(clampedStep)
    },
    [totalSteps, onStepChange]
  )

  const next = React.useCallback(() => {
    if (allowLooping && currentStep === totalSteps - 1) {
      safeSetCurrentStep(0)
    } else {
      safeSetCurrentStep(currentStep + 1)
    }
  }, [currentStep, totalSteps, allowLooping, safeSetCurrentStep])

  const previous = React.useCallback(() => {
    if (allowLooping && currentStep === 0) {
      safeSetCurrentStep(totalSteps - 1)
    } else {
      safeSetCurrentStep(currentStep - 1)
    }
  }, [currentStep, totalSteps, allowLooping, safeSetCurrentStep])

  const goTo = React.useCallback(
    (step: number) => {
      safeSetCurrentStep(step)
    },
    [safeSetCurrentStep]
  )

  const isFirstStep = !allowLooping && currentStep === 0
  const isLastStep = !allowLooping && currentStep === totalSteps - 1
  const canGoNext = allowLooping || currentStep < totalSteps - 1
  const canGoPrevious = allowLooping || currentStep > 0

  const progress = React.useMemo(
    () => (currentStep + 1) / totalSteps,
    [currentStep, totalSteps]
  )

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    next,
    previous,
    goTo,
    progress,
    canGoNext,
    canGoPrevious,
  }
}
