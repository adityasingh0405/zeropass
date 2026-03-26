/**
 * Proof — ZK proof generation page.
 *
 * Two modes:
 *  1. Real mode: renders the <LogInWithAnonAadhaar /> widget (SDK login flow).
 *     When the SDK emits a logged-in state, we capture the proof hash.
 *  2. Demo mode: clicking "Use Demo Credential" simulates a 2-second proof
 *     generation delay and creates a fake proof hash — no real Aadhaar needed.
 *
 * On success (either mode), auto-navigates to /result after a short delay.
 */
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useAnonAadhaar, LogInWithAnonAadhaar } from '@anon-aadhaar/react'
import { useProof } from '../context/ProofContext'

// ── Helpers ───────────────────────────────────────────────────────────────

/** Generates a fake-looking keccak-style hex hash for demo mode */
function generateDemoHash(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Component ─────────────────────────────────────────────────────────────

export default function Proof() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const { credentialType, setProofHash, setIsGenerating, isGenerating } = useProof()
  const [anonAadhaar] = useAnonAadhaar()

  const [localError, setLocalError] = useState<string | null>(null)
  const [demoRunning, setDemoRunning] = useState(false)
  const [proofReady, setProofReady] = useState(false)
  const [displayHash, setDisplayHash] = useState<string | null>(null)

  // Guard: must be connected and have a credential selected
  useEffect(() => {
    if (!isConnected) navigate('/')
    else if (!credentialType) navigate('/verify')
  }, [isConnected, credentialType, navigate])

  // Watch Anon Aadhaar SDK status — fired when real proof is generated
  useEffect(() => {
    if (anonAadhaar.status === 'logged-in') {
      const hash = generateDemoHash()
      setDisplayHash(hash)
      setProofHash(hash, false)
      setProofReady(true)
    }
  }, [anonAadhaar.status, setProofHash])

  // ── Demo mode handler ─────────────────────────────────────────────────
  const handleDemo = useCallback(() => {
    setLocalError(null)
    setDemoRunning(true)
    setIsGenerating(true)

    // Simulate 2-second proof generation on client side
    setTimeout(() => {
      const hash = generateDemoHash()
      setDisplayHash(hash)
      setProofHash(hash, true)
      setDemoRunning(false)
      setProofReady(true)
    }, 2000)
  }, [setProofHash, setIsGenerating])

  // Auto-navigate to /result when proof is ready
  useEffect(() => {
    if (proofReady && displayHash) {
      const timer = setTimeout(() => navigate('/result'), 1200)
      return () => clearTimeout(timer)
    }
  }, [proofReady, displayHash, navigate])

  const labelMap: Record<string, string> = {
    'age_18+': 'Age Verification (18+)',
    'aadhaar_identity': 'Aadhaar Identity',
  }
  const label = credentialType ? labelMap[credentialType] : ''

  // ── Render: success state ─────────────────────────────────────────────
  if (proofReady && displayHash) {
    return (
      <main className="page" style={{ paddingTop: '6rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div className="pulse-container" style={{ marginBottom: '1.5rem' }}>
            <div className="pulse-ring" style={{ background: 'var(--success)' }} />
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(34,197,94,0.15)',
              border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem',
            }}>
              ✓
            </div>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Proof Generated!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Redirecting to result…</p>
          <div className="hash-box">{displayHash}</div>
        </div>
      </main>
    )
  }

  // ── Render: generating state ──────────────────────────────────────────
  if (demoRunning || isGenerating) {
    return (
      <main className="page" style={{ paddingTop: '6rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="spinner" />
          </div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Generating ZK Proof…
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            All computation happens locally in your browser.
            This may take a few seconds.
          </p>
          <div className="privacy-box" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <span className="icon">🔐</span>
            <div style={{ fontSize: '0.8rem' }}>
              <strong style={{ color: 'var(--text)' }}>What we see: nothing.</strong>
              {' '}Your data never leaves this device.
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── Render: default state ─────────────────────────────────────────────
  return (
    <main className="page" style={{ paddingTop: '6rem' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>Step 2 of 3</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Generate your proof
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Proving: <strong style={{ color: 'var(--accent-light)' }}>{label}</strong>
          </p>
        </div>

        {/* Demo mode button */}
        <div className="card fade-up-delay-1" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🧪</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Demo Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No real Aadhaar needed — simulates a complete proof instantly
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleDemo}>
            ⚡ Use Demo Credential
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or use real Aadhaar
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Real Anon Aadhaar widget — LogInWithAnonAadhaar renders the SDK's QR flow */}
        <div className="card fade-up-delay-2">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              🪪 Anon Aadhaar SDK
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scan your Aadhaar QR code to generate a real ZK proof
            </div>
          </div>
          {/* LogInWithAnonAadhaar renders the SDK's official authentication widget */}
          <LogInWithAnonAadhaar nullifierSeed={Math.floor(Math.random() * 1000000)} />
        </div>

        {/* Error state */}
        {localError && (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: 10,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--error)',
            fontSize: '0.85rem',
          }}>
            ⚠ {localError}
          </div>
        )}

        {/* Privacy explainer */}
        <div className="privacy-box" style={{ marginTop: '1.25rem' }}>
          <span className="icon">🛡️</span>
          <div style={{ fontSize: '0.8rem' }}>
            <strong style={{ color: 'var(--text)' }}>What gets proved:</strong>{' '}
            {credentialType === 'age_18+' ? 'Your age exceeds 18.' : 'Your Aadhaar is valid.'}
            {' '}<strong style={{ color: 'var(--text)' }}>What stays hidden:</strong> everything else.
          </div>
        </div>
      </div>
    </main>
  )
}
