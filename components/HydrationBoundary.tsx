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

const COUNT_KEY = "_hb_chunk_reloads"
const TS_KEY    = "_hb_chunk_reloads_ts"

// Max 3 reloads within a 30-second window. Resets automatically after 30 s.
function shouldReloadForChunk(): boolean {
  try {
    const count = parseInt(sessionStorage.getItem(COUNT_KEY) ?? "0", 10)
    const ts    = parseInt(sessionStorage.getItem(TS_KEY)    ?? "0", 10)
    // Counter resets if last reload was more than 30 seconds ago
    const fresh = isNaN(ts) || Date.now() - ts > 30_000
    const cur   = fresh ? 0 : count
    if (cur >= 3) return false
    sessionStorage.setItem(COUNT_KEY, String(cur + 1))
    sessionStorage.setItem(TS_KEY,    String(Date.now()))
    return true
  } catch {
    return true
  }
}

// Force a fresh fetch by adding a unique query param — bypasses CDN/browser cache.
function reloadFresh(): void {
  const url = new URL(window.location.href)
  url.searchParams.set("_r", Date.now().toString())
  window.location.replace(url.toString())
}

export default class HydrationBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { errorKey: 0, hasError: false }
  private _resetTimer: ReturnType<typeof setTimeout> | null = null

  componentDidMount() {
    // Remove cache-buster param added by reloadFresh() so the URL stays clean
    const url = new URL(window.location.href)
    if (url.searchParams.has("_r")) {
      url.searchParams.delete("_r")
      window.history.replaceState({}, "", url.toString())
    }

    // After 10 s of successful operation, reset the reload counter so future
    // ChunkLoadErrors (e.g. after a new deployment) can trigger reloads again.
    this._resetTimer = setTimeout(() => {
      try {
        sessionStorage.removeItem(COUNT_KEY)
        sessionStorage.removeItem(TS_KEY)
      } catch { /* ignore */ }
    }, 10_000)

    window.addEventListener("error", this.handleError)
    window.addEventListener("unhandledrejection", this.handleChunkRejection)
  }

  componentWillUnmount() {
    if (this._resetTimer) clearTimeout(this._resetTimer)
    window.removeEventListener("error", this.handleError)
    window.removeEventListener("unhandledrejection", this.handleChunkRejection)
  }

  handleError = (event: ErrorEvent) => {
    const msg = event.message ?? ""

    if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
      if (shouldReloadForChunk()) reloadFresh()
      return
    }

    // Extension-caused DOM mutation during React commit — remount the tree.
    // preventDefault stops the browser from surfacing "This page couldn't load".
    if (DOM_ERROR_PATTERNS.some(p => msg.includes(p))) {
      event.preventDefault()
      this.setState(s => ({ errorKey: s.errorKey + 1, hasError: false }))
    }
  }

  handleChunkRejection = (event: PromiseRejectionEvent) => {
    const msg = String(event.reason ?? "")
    if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
      if (shouldReloadForChunk()) reloadFresh()
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
