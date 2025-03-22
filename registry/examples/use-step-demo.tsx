"use client"

import { Button } from "@/components/ui/button"
import { useStep } from "registry/hooks/use-step"

export default function UseStepDemo() {
  const [currentStep, helpers] = useStep(5)

  const {
    canGoToPrevStep,
    canGoToNextStep,
    goToNextStep,
    goToPrevStep,
    reset,
    setStep,
  } = helpers

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <p>Current step is {currentStep}</p>
      <p>Can go to previous step - {canGoToPrevStep ? "yes" : "no"}</p>
      <p>Can go to next step - {canGoToNextStep ? "yes" : "no"}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={goToNextStep} disabled={!canGoToNextStep}>
          Go to next step
        </Button>
        <Button onClick={goToPrevStep} disabled={!canGoToPrevStep}>
          Go to previous step
        </Button>
        <Button onClick={reset} disabled={currentStep === 1}>
          Reset
        </Button>
        <Button
          onClick={() => {
            setStep(3)
          }}
          disabled={currentStep === 3}
        >
          Set to step 3
        </Button>
      </div>
    </div>
  )
}
