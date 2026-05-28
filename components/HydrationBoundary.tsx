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

export default class HydrationBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { errorKey: 0, hasError: false }

  // ── Detect stale chunk errors and hard-reload to get fresh HTML ──────────
  componentDidMount() {
    window.addEventListener("error", this.handleChunkError)
    window.addEventListener("unhandledrejection", this.handleChunkRejection)
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.handleChunkError)
    window.removeEventListener("unhandledrejection", this.handleChunkRejection)
  }

  handleChunkError = (event: ErrorEvent) => {
    const msg = event.message ?? ""
    if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
      window.location.reload()
    }
  }

  handleChunkRejection = (event: PromiseRejectionEvent) => {
    const msg = String(event.reason ?? "")
    if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
      window.location.reload()
    }
  }

  // ── Recover from React hydration errors caused by browser extensions ─────
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
