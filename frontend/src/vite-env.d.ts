/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}

declare module '*.module.scss' {
  const classes: CSSModuleClasses
  export default classes
}

// Images
declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

// Fonts
declare module '*.woff' {
  const src: string
  export default src
}

declare module '*.woff2' {
  const src: string
  export default src
}

declare module '*.ttf' {
  const src: string
  export default src
}

declare module '*.eot' {
  const src: string
  export default src
}

// Tailwind CSS
declare module 'tailwindcss/plugin' {
  import { PluginCreator } from 'postcss'
  const plugin: PluginCreator<unknown>
  export default plugin
}

declare module 'tailwindcss/colors' {
  export const zinc: Record<string, string>
  export const slate: Record<string, string>
  export const gray: Record<string, string>
  export const neutral: Record<string, string>
  export const stone: Record<string, string>
  export const red: Record<string, string>
  export const orange: Record<string, string>
  export const amber: Record<string, string>
  export const yellow: Record<string, string>
  export const lime: Record<string, string>
  export const green: Record<string, string>
  export const emerald: Record<string, string>
  export const teal: Record<string, string>
  export const cyan: Record<string, string>
  export const sky: Record<string, string>
  export const blue: Record<string, string>
  export const indigo: Record<string, string>
  export const violet: Record<string, string>
  export const purple: Record<string, string>
  export const fuchsia: Record<string, string>
  export const pink: Record<string, string>
  export const rose: Record<string, string>
}

// Environment Variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
