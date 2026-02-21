"use client"

import { useState, useCallback, useEffect } from "react"
import type { Step, CallBackProps } from "react-joyride"

const TOUR_COMPLETED_KEY = "jigsaw-tour-completed"

const tourSteps: Step[] = [
  {
    target: "body",
    content:
      "Welcome to Jigsaw — your strategic planning system. This quick tour will show you the key areas of the interface.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav-sidebar"]',
    content:
      "This is the navigation sidebar. Switch between different systems, access the Admin console, or open the Canvas view.",
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-tour="view-tabs"]',
    content:
      "These tabs switch between the four matrix views: Logic Model (the strategic grid), Convergence Map (external factors), Contribution Map (outcomes vs value chain), and Development Pathways (resources vs value chain).",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="toolbar-modes"]',
    content:
      "Use these mode buttons to interact with the data. View mode is read-only. Edit lets you modify content. Colour changes element colours. Order lets you drag to reorder. Delete removes elements.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="export-button"]',
    content:
      "Export the current view as CSV, Excel, or PDF to share with stakeholders.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="sign-out"]',
    content: "Sign out of your account here when you're done.",
    placement: "bottom",
    disableBeacon: true,
  },
]

export function useOnboardingTour() {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  // Auto-start on first visit
  useEffect(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY)
    if (!completed) {
      // Small delay so DOM elements are rendered
      const timer = setTimeout(() => setRun(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCallback = useCallback((data: CallBackProps) => {
    const { status, index, type } = data
    const finishedStatuses: string[] = ["finished", "skipped"]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      setStepIndex(0)
      localStorage.setItem(TOUR_COMPLETED_KEY, "true")
    } else if (type === "step:after") {
      setStepIndex(index + 1)
    }
  }, [])

  const restartTour = useCallback(() => {
    setStepIndex(0)
    setRun(true)
  }, [])

  return {
    run,
    stepIndex,
    steps: tourSteps,
    handleCallback,
    restartTour,
  }
}
