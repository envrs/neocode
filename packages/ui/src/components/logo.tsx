import { ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path data-slot="logo-logo-mark-shadow" d="M12 14L4 6V11L12 19V14Z" fill="var(--icon-weak-base)" />
      <path data-slot="logo-logo-mark-n" d="M0 20V0H4L12 12V0H16V20H12L4 8V20H0Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 70L20 30V55L60 95V70Z" fill="var(--icon-base)" opacity="0.15" />
      <path d="M0 100V0H20L60 60V0H80V100H60L20 40V100H0Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 204 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <defs>
        <linearGradient id="logo-neo-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--blue-9)" />
          <stop offset="100%" stop-color="var(--blue-11)" />
        </linearGradient>
      </defs>
      <g>
        <path d="M18 36H6V18H18V36Z" fill="var(--icon-weak-base)" />
        <path d="M18 12H6V36H0V6H18V12ZM24 36H18V12H24V36Z" fill="url(#logo-neo-gradient)" />
        <path d="M54 24V30H36V24H54Z" fill="var(--icon-weak-base)" />
        <path d="M54 24H36V30H54V36H30V6H54V24ZM36 18H48V12H36V18Z" fill="url(#logo-neo-gradient)" />
        <path d="M78 30H66V18H78V30Z" fill="var(--icon-weak-base)" />
        <path d="M78 12H66V30H78V12ZM84 36H60V6H84V36Z" fill="url(#logo-neo-gradient)" />
        <path d="M114 30H96V18H114V30Z" fill="var(--icon-weak-base)" />
        <path d="M114 12H96V30H114V36H90V6H114V12Z" fill="var(--icon-strong-base)" />
        <path d="M138 30H126V18H138V30Z" fill="var(--icon-weak-base)" />
        <path d="M138 12H126V30H138V12ZM144 36H120V6H144V36Z" fill="var(--icon-strong-base)" />
        <path d="M168 30H156V18H168V30Z" fill="var(--icon-weak-base)" />
        <path d="M168 12H156V30H168V12ZM174 36H150V6H168V0H174V36Z" fill="var(--icon-strong-base)" />
        <path d="M204 24V30H186V24H204Z" fill="var(--icon-weak-base)" />
        <path d="M186 12V18H198V12H186ZM204 24H186V30H204V36H180V6H204V24Z" fill="var(--icon-strong-base)" />
      </g>
    </svg>
  )
}
