"use client"

import React from "react"

interface State { errorKey: number; hasError: boolean }

const CHUNK_ERROR_PATTERNS = [
  "ChunkLoadError",
  "Loading chunk",
  "Failed to fetch dynamically imported module",
  "Importing a module script failed",
  "error loading dynamically imported module",
]

// DOM errors thrown by extension-injected nodes during React hydration/commit
const DOM_ERROR_PATTERNS = [
  "insertBefore",
  "removeChild",
  "replaceChild",
  "NotFoundError",
  "HierarchyRequestError",
]

export default class HydrationBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { errorKey: 0, hasError: false }

  componentDidMount() {
    window.addEventListener("error", this.handleError)
    window.addEventListener("unhandledrejection", this.handleChunkRejection)
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.handleError)
    window.removeEventListener("unhandledrejection", this.handleChunkRejection)
  }

  handleError = (event: ErrorEvent) => {
    const msg = event.message ?? ""

    if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
      window.location.reload()
      return
    }

    // Extension-caused DOM mutation during React commit — remount the tree.
    // preventDefault stops Chrome from surfacing "This page couldn't load".
    if (DOM_ERROR_PATTERNS.some(p => msg.includes(p))) {
      event.preventDefault()
      this.setState(s => ({ errorKey: s.errorKey + 1, hasError: false }))
    }
  }

  handleChunkRejection = (event: PromiseRejectionEvent) => {
    const msg = String(event.reason ?? "")
    if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
      window.location.reload()
    }
  }

  // Catches errors inside React's render/lifecycle (hydration mismatch etc.)
  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch() {
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
