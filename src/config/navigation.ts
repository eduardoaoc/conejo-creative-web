export const navItems = [
  { href: '/', key: 'home' },
  { href: '/servicios', key: 'services' },
  { href: '/proyectos', key: 'projects' },
  { href: '/nosotros', key: 'about' },
  { href: '/contacto', key: 'contact' },
] as const;

export type NavItem = (typeof navItems)[number];
