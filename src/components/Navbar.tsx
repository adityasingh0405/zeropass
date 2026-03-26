/**
 * Navbar — persistent top navigation bar.
 * Shows the ZeroPass logo, current step indicator, and the RainbowKit connect button.
 */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useLocation, Link } from 'react-router-dom'

const STEPS = [
  { path: '/', label: 'Connect' },
  { path: '/verify', label: 'Choose' },
  { path: '/proof', label: 'Prove' },
  { path: '/result', label: 'Submit' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const currentIdx = STEPS.findIndex(s => s.path === pathname)

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span className="logo">⬡ ZeroPass</span>
      </Link>

      {/* Step progress bar (hidden on home) */}
      {currentIdx > 0 && (
        <div className="step-bar" style={{ flex: 1, maxWidth: 220, margin: '0 2rem' }}>
          {STEPS.slice(1).map((step, i) => {
            const stepIdx = i + 1
            const isDone = stepIdx < currentIdx
            const isActive = stepIdx === currentIdx
            return (
              <div key={step.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div
                  className={`step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  title={step.label}
                />
                {i < STEPS.length - 2 && (
                  <div className={`step-line ${isDone ? 'done' : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* RainbowKit wallet connect button */}
      <ConnectButton
        label="Connect Wallet"
        accountStatus="avatar"
        chainStatus="none"
        showBalance={false}
      />
    </nav>
  )
}
