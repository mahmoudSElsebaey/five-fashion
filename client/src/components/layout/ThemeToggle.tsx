import { useCallback, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

/** Curtain wipe theme toggle (21st-style). */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [animating, setAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    if (animating) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    setAnimating(true);

    const curtain = document.createElement('div');
    curtain.setAttribute('aria-hidden', 'true');
    curtain.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'pointer-events:none',
      `background:${next === 'dark' ? '#1A1A1C' : '#F9F7F4'}`,
      'transform:translateY(-100%)',
      'transition:transform 0.55s cubic-bezier(0.65,0,0.35,1)',
    ].join(';');
    document.body.appendChild(curtain);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.style.transform = 'translateY(0)';
      });
    });

    window.setTimeout(() => {
      setTheme(next);
      curtain.style.transform = 'translateY(100%)';
      window.setTimeout(() => {
        curtain.remove();
        setAnimating(false);
      }, 560);
    }, 520);
  }, [animating, setTheme, theme]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={animating}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-9 w-9 rounded-full p-0 text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-muted hover:text-foreground"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </Button>
  );
}
