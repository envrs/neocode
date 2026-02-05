import { JSX } from "solid-js"

type GlyphProps = { x: number; color?: string; weakColor?: string }

// Paths extracted from logo-ornate set and translated to 0,0 base
// Box size for each letter is roughly 24x36 within a 30-unit width cell

const N = (p: GlyphProps) => (
  <g transform={`translate(${p.x}, 0)`}>
    <path d="M18 36H6V18H18V36Z" fill={p.weakColor || "var(--icon-weak-base)"} />
    <path d="M18 12H6V36H0V6H18V12ZM24 36H18V12H24V36Z" fill={p.color || "var(--icon-base)"} />
  </g>
)

const E = (p: GlyphProps) => (
  <g transform={`translate(${p.x}, 0)`}>
    <path d="M24 24V30H6V24H24Z" fill={p.weakColor || "var(--icon-weak-base)"} />
    <path d="M24 24H6V30H24V36H0V6H24V24ZM6 18H18V12H6V18Z" fill={p.color || "var(--icon-base)"} />
  </g>
)

const O = (p: GlyphProps) => (
  <g transform={`translate(${p.x}, 0)`}>
    <path d="M18 30H6V18H18V30Z" fill={p.weakColor || "var(--icon-weak-base)"} />
    <path d="M18 12H6V30H18V12ZM24 36H0V6H24V36Z" fill={p.color || "var(--icon-base)"} />
  </g>
)

const C = (p: GlyphProps) => (
  <g transform={`translate(${p.x}, 0)`}>
    <path d="M24 30H6V18H24V30Z" fill={p.weakColor || "var(--icon-weak-base)"} />
    <path d="M24 12H6V30H24V36H0V6H24V12Z" fill={p.color || "var(--icon-base)"} />
  </g>
)

const D = (p: GlyphProps) => (
  <g transform={`translate(${p.x}, 0)`}>
    <path d="M18 30H6V18H18V30Z" fill={p.weakColor || "var(--icon-weak-base)"} />
    <path d="M18 12H6V30H18V12ZM24 36H18V6H18V0H24V36Z" fill={p.color || "var(--icon-base)"} />
  </g>
)

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <N x={0} color="var(--icon-strong-base)" />
    </svg>
  )
}

export const Splash = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 24 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <N x={0} color="var(--icon-strong-base)" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 234 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <N x={0} />
      <E x={30} />
      <O x={60} />
      {/* Gap for "NEO CODE" spacing */}
      <C x={120} color="var(--icon-strong-base)" />
      <O x={150} color="var(--icon-strong-base)" />
      <D x={180} color="var(--icon-strong-base)" />
      <E x={210} color="var(--icon-strong-base)" />
    </svg>
  )
}
