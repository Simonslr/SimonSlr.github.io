"use client"

import React from "react"

interface State { errorKey: number; hasError: boolean }

export default class HydrationBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { errorKey: 0, hasError: false }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch() {
    // Increment key → forces complete unmount + client-only remount
    // The new mount has no server HTML to hydrate against = no mismatch possible
    this.setState(s => ({ errorKey: s.errorKey + 1, hasError: false }))
  }

  render() {
    return (
      <React.Fragment key={this.state.errorKey}>
        {this.props.children}
      </React.Fragment>
    )
  }
}
