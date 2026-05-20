"use client"

import { useRef, type ReactNode, type HTMLAttributes } from "react"

interface Props extends HTMLAttributes<HTMLElement> {
  children:  ReactNode
  strength?: number
  tag?:      "button" | "a" | "div"
}

export default function MagneticButton({
  children,
  strength = 0.28,
  tag:      Tag = "button",
  className,
  style,
  ...props
}: Props) {
  const ref = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width  / 2)) * strength
    const dy = (e.clientY - (r.top  + r.height / 2)) * strength
    el.style.transition = "transform 120ms ease-out"
    el.style.transform  = `translate(${dx}px, ${dy}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)"
    el.style.transform  = "translate(0, 0)"
  }

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={style}
      onMouseMove={onMove as any}
      onMouseLeave={onLeave}
      {...(props as any)}
    >
      {children}
    </Tag>
  )
}
