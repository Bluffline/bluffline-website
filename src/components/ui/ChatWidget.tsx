import { useState, useEffect, useCallback } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

// ─── Mobile detection ─────────────────────────────────────────────────────────

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  // Initialize synchronously so there's no layout flash on first render.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

// ─── Session fetcher ──────────────────────────────────────────────────────────

async function fetchClientSecret(existing: string | null | undefined): Promise<string> {
  // If the existing token is still valid, return it so ChatKit doesn't
  // create a new session unnecessarily.
  if (existing) return existing;

  const res = await fetch('/api/chatkit/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Session endpoint returned ${res.status}`);
  }

  const data = await res.json();
  return data.client_secret;
}

// ─── Chat icon SVGs ───────────────────────────────────────────────────────────

function ChatBubbleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const getClientSecret = useCallback(
    (existing: string | null | undefined) => fetchClientSecret(existing),
    [],
  );

  const { control } = useChatKit({
    api: { getClientSecret },
  });

  const toggle = () => setIsOpen((prev) => !prev);

  // On mobile the panel fills the entire viewport; on desktop it floats.
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0,
        overflow: 'hidden',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        zIndex: 1000,
        background: '#fff',
      }
    : {
        position: 'fixed',
        bottom: '5.5rem',
        right: '1.5rem',
        width: 'min(380px, calc(100vw - 2rem))',
        height: 'min(600px, calc(100vh - 8rem))',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(45, 48, 71, 0.18)',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        zIndex: 1000,
        background: '#fff',
      };

  return (
    <>
      {/* ── Floating panel ── */}
      <div
        role="dialog"
        aria-label="Bluffline assistant"
        aria-modal="true"
        aria-hidden={!isOpen}
        style={panelStyle}
      >
        {/* Panel header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.875rem 1rem',
            background: '#41521F',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <ChatBubbleIcon />
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '0.9375rem', flex: 1 }}>
            Ask about The Bluffline
          </span>
          {isMobile && (
            <button
              onClick={toggle}
              aria-label="Close chat"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* ChatKit fills the remaining panel space */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatKit control={control} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* ── FAB toggle button (hidden on mobile when chat is open) ── */}
      <button
        onClick={toggle}
        aria-label={isOpen ? 'Close chat' : 'Open Bluffline assistant'}
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: '#41521F',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: isMobile && isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(65, 82, 31, 0.4)',
          zIndex: 1001,
          transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = '#2f3c17';
          btn.style.transform = 'scale(1.05)';
          btn.style.boxShadow = '0 6px 20px rgba(65, 82, 31, 0.5)';
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = '#41521F';
          btn.style.transform = 'scale(1)';
          btn.style.boxShadow = '0 4px 16px rgba(65, 82, 31, 0.4)';
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
      </button>
    </>
  );
}
