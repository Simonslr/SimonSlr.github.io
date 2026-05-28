"use client"

import React from "react"

interface State { crashed: boolean }

export default class HydrationBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  componentDidCatch(error: Error) {
    // Only recover from hydration mismatches (extension injection)
    if (
      error.message.includes("Minified React error #418") ||
      error.message.includes("Minified React error #423") ||
      error.message.includes("Minified React error #425") ||
      error.message.includes("hydrat") ||
      error.message.includes("Text content did not match") ||
      error.message.includes("did not match")
    ) {
      // Force a clean client-side re-render
      this.setState({ crashed: false })
    }
  }

  render() {
    return this.props.children
  }
}
