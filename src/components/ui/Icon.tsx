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
  | 'home'
  | 'chat'
  | 'heart'
  | 'megaphone'
  | 'tree'
  | 'workshop'
  | 'sparkles'
  | 'bot'
  | 'link'
  | 'user'
  | 'store'
  | 'menu'
  | 'close'
  | 'logout'
  | 'lock'

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
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9.5 21v-6h5v6',
  chat: 'M21 11.5c0 4.7-4 8.5-9 8.5-1.3 0-2.6-.3-3.7-.8L3 20.5l1.3-4C3.5 15 3 13.3 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z',
  heart:
    'M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.6 0 3.2.8 4.2 2.2C13 4.8 14.6 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z',
  megaphone: 'M3 10v4h3l8 5V5l-8 5H3zm15-2a5 5 0 010 8',
  tree: 'M12 22v-7m0 0c-4 0-7-2.5-7-6 0-2 1-3.7 2.5-4.6C8 2.6 10 2 12 2s4 .6 4.5 2.4C18 5.3 19 7 19 9c0 3.5-3 6-7 6z',
  workshop: 'M3 3h18M5 3v11h14V3M12 14v3m-4.5 4L12 17l4.5 4',
  sparkles:
    'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3zM19 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2zM5 15.5l.7 1.7 1.7.7-1.7.7L5 20.3l-.7-1.7-1.7-.7 1.7-.7.7-1.7z',
  bot: 'M9 7V4h6v3M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2zm4 4.5h.01M15 11.5h.01M9 15.5h6',
  link: 'M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  store: 'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9.5 20v-6h5v6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  lock: 'M5 11h14v10H5V11zm3 0V7a4 4 0 018 0v4M12 15v2.5',
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
