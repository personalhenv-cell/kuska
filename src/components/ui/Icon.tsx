/** Set de íconos line-style (stroke, 24x24) — DESIGN.md prohíbe emoji como
 *  ícono principal de UI. Un solo componente para no repetir paths SVG. */
export type IconName =
  | 'dashboard'
  | 'users'
  | 'palette'
  | 'box'
  | 'academy'
  | 'tent'
  | 'wallet'
  | 'chart'
  | 'qrcode'
  | 'download'
  | 'bell'
  | 'receipt'
  | 'rocket'

const PATHS: Record<IconName, string> = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  users:
    'M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M11 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  palette:
    'M12 2a10 10 0 100 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c2 0 3.6-1.6 3.6-3.6C21 6.5 17 2 12 2zM6.5 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z',
  box: 'M21 8l-9-5-9 5m18 0l-9 5m9-5v10l-9 5M3 8l9 5m-9-5v10l9 5m0-10v10',
  academy: 'M22 10L12 4 2 10l10 6 10-6zM6 12.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 10v6',
  tent: 'M12 3l9 17H3l9-17zm0 6l4.5 11M12 9L7.5 20',
  wallet:
    'M3 7a2 2 0 012-2h13a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm16 3h-3a2 2 0 000 4h3',
  chart: 'M3 3v18h18M8 17V10m5 7V6m5 11v-4',
  qrcode:
    'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h2m2 0h2m-6 3h2m2-6v2m0 2v2',
  download: 'M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0',
  receipt:
    'M6 2h12v20l-3-2-3 2-3-2-3 2V2zM8 7h8M8 11h8M8 15h5',
  rocket:
    'M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-1 3-2-2-2 2-1-3c-1-1-2-3-2-5 0-4 2-8 5-10zM8.5 15.5L5 17l1.5-3.5M15.5 15.5L19 17l-1.5-3.5M10 9a2 2 0 104 0 2 2 0 00-4 0z',
}

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
