"use client"

import dynamic from "next/dynamic"
import type { CallBackProps, Step } from "react-joyride"

// Dynamic import to avoid SSR issues with react-joyride
const Joyride = dynamic(() => import("react-joyride"), { ssr: false })

interface OnboardingTourProps {
  run: boolean
  stepIndex: number
  steps: Step[]
  onCallback: (data: CallBackProps) => void
}

export function OnboardingTour({ run, stepIndex, steps, onCallback }: OnboardingTourProps) {
  return (
    <Joyride
      run={run}
      stepIndex={stepIndex}
      steps={steps}
      callback={onCallback}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      spotlightClicks={false}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#0d9488",
          textColor: "#1e293b",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
        },
        spotlight: {
          borderRadius: 8,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
          fontSize: 14,
        },
        tooltipTitle: {
          fontSize: 16,
          fontWeight: 600,
        },
        buttonNext: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 500,
        },
        buttonBack: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 500,
          color: "#64748b",
        },
        buttonSkip: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 500,
          color: "#94a3b8",
        },
      }}
      locale={{
        back: "Back",
        close: "Got it",
        last: "Finish",
        next: "Next",
        skip: "Skip tour",
      }}
    />
  )
}
