'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CalendarDays, History, Building2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, CalendarDays, History, Building2,
};

const NAV_ITEMS = [
  { href: '/generate', label: 'Generate', icon: 'Sparkles' },
  { href: '/calendar', label: 'Calendar', icon: 'CalendarDays' },
  { href: '/history', label: 'History', icon: 'History' },
  { href: '/brand', label: 'Brand', icon: 'Building2' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-faint)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/generate" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            CopyCraft
          </span>
          <span style={{ color: 'var(--accent-saffron)', fontSize: 28, lineHeight: 1 }}>·</span>
        </Link>

        {/* Nav Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href || (item.href === '/generate' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-tab',
                  isActive && 'nav-tab-active'
                )}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  color: isActive ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                }}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 99,
              background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            CC
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-tab:hover {
          color: var(--text-primary) !important;
          background: var(--bg-elevated) !important;
        }
        .nav-tab-active:hover {
          color: var(--accent-saffron) !important;
          background: var(--accent-glow) !important;
        }
        @media (max-width: 640px) {
          .nav-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
