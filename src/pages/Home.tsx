/**
 * Home — Landing page.
 *
 * Design: Dark hero with purple radial glow.
 * Shows the headline, sub-headline, and the RainbowKit "Connect Wallet" button.
 * Redirects to /verify once the wallet is connected.
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()

  // Auto-redirect if wallet already connected
  useEffect(() => {
    if (isConnected) navigate('/verify')
  }, [isConnected, navigate])

  return (
    <main className="page" style={{ paddingTop: '5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>

        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span className="badge badge-purple fade-up">
            <span>🔐</span> Zero-Knowledge Identity
          </span>
        </div>

        {/* Headline */}
        <h1
          className="fade-up-delay-1"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}
        >
          Prove who you are.{' '}
          <span className="gradient-text">Reveal nothing.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="fade-up-delay-2"
          style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}
        >
          ZeroPass uses zero-knowledge proofs to let you verify your identity on-chain
          without exposing any personal data. Your proof stays on your device.
        </p>

        {/* Connect button */}
        <div className="fade-up-delay-3" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <ConnectButton label="Connect Wallet →" />
        </div>

        {/* Feature pills */}
        <div
          className="fade-up-delay-3"
          style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}
        >
          {['No data leaves your device', 'On-chain attestation', 'Aadhaar-backed ZK proof'].map(f => (
            <span
              key={f}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          opacity: 0.5,
        }}
      />
    </main>
  )
}
