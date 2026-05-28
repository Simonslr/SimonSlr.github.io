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

// DOM errors thrown by extension-injected nodes or React hydration recovery
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

// Navigate to a unique URL so the browser bypasses its cache entirely.
function reloadFresh(): void {
  const url = new URL(window.location.href)
  url.searchParams.set("_r", Date.now().toString())
  window.location.replace(url.toString())
}

// Module-level singleton — lets the global handlers call setState even after mount.
let _boundary: HydrationBoundary | null = null

function onWindowError(event: ErrorEvent): void {
  const msg = event.message ?? ""

  if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
    if (shouldReloadForChunk()) reloadFresh()
    return
  }

  // DOM mutation errors during React hydration recovery or extension injection.
  // preventDefault stops Chrome from surfacing them as "This page couldn't load".
  // The actual tree remount is done by componentDidCatch (or the setState below
  // when the boundary is already mounted).
  if (DOM_ERROR_PATTERNS.some(p => msg.includes(p))) {
    event.preventDefault()
    _boundary?.setState(s => ({ errorKey: s.errorKey + 1, hasError: false }))
  }
}

function onUnhandledRejection(event: PromiseRejectionEvent): void {
  const msg = String(event.reason ?? "")
  if (CHUNK_ERROR_PATTERNS.some(p => msg.includes(p))) {
    if (shouldReloadForChunk()) reloadFresh()
  }
}

// Attach BEFORE React starts hydrating so errors during hydration are caught.
// Module-level code runs once when the bundle is parsed, before any render.
if (typeof window !== "undefined") {
  window.addEventListener("error", onWindowError)
  window.addEventListener("unhandledrejection", onUnhandledRejection)
}

export default class HydrationBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { errorKey: 0, hasError: false }
  private _resetTimer: ReturnType<typeof setTimeout> | null = null

  componentDidMount() {
    _boundary = this

    // Remove cache-buster param added by reloadFresh() so the URL stays clean.
    const url = new URL(window.location.href)
    if (url.searchParams.has("_r")) {
      url.searchParams.delete("_r")
      window.history.replaceState({}, "", url.toString())
    }

    // After 10 s of successful operation reset the reload counter so future
    // ChunkLoadErrors (e.g. after a new deployment) can trigger reloads again.
    this._resetTimer = setTimeout(() => {
      try {
        sessionStorage.removeItem(COUNT_KEY)
        sessionStorage.removeItem(TS_KEY)
      } catch { /* ignore */ }
    }, 10_000)
  }

  componentWillUnmount() {
    _boundary = null
    if (this._resetTimer) clearTimeout(this._resetTimer)
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
