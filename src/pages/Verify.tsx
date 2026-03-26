/**
 * Verify — Credential selection page.
 *
 * Guards against unauthenticated access (redirects to / if wallet not connected).
 * Shows two options:
 *   1. Prove Age (18+)
 *   2. Prove Aadhaar Identity
 * Each card explains what gets proven vs. what stays private.
 */
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useProof, type CredentialType } from '../context/ProofContext'

interface CredentialOption {
  id: CredentialType
  icon: string
  title: string
  subtitle: string
  proves: string
  hides: string
}

const OPTIONS: CredentialOption[] = [
  {
    id: 'age_18+',
    icon: '🎂',
    title: 'Prove Age (18+)',
    subtitle: 'Confirm you are over 18 without sharing your date of birth',
    proves: 'You are 18 years or older',
    hides: 'Your exact age, DOB, and all other Aadhaar fields',
  },
  {
    id: 'aadhaar_identity',
    icon: '🇮🇳',
    title: 'Prove Aadhaar Identity',
    subtitle: 'Confirm you are a verified Indian citizen',
    proves: 'Your Aadhaar number is valid and active',
    hides: 'Your name, address, Aadhaar number, and all biometrics',
  },
]

export default function Verify() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const { setCredential } = useProof()

  // Guard: must have wallet connected
  useEffect(() => {
    if (!isConnected) navigate('/')
  }, [isConnected, navigate])

  function handleSelect(id: CredentialType) {
    setCredential(id)
    navigate('/proof')
  }

  return (
    <main className="page" style={{ paddingTop: '6rem' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>Step 1 of 3</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Choose what to prove
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Select a credential type. Your proof is generated locally — nothing is ever sent to a server.
          </p>
        </div>

        {/* Credential cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {OPTIONS.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="card"
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                background: 'none',
                color: 'inherit',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{opt.title}</h3>
                    <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>→</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {opt.subtitle}
                  </p>

                  {/* Privacy breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '0.6rem 0.8rem' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--success)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        ✓ Proves
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.proves}</div>
                    </div>
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.6rem 0.8rem' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--error)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        ✕ Hides
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.hides}</div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Privacy note */}
        <div className="privacy-box" style={{ marginTop: '1.5rem' }}>
          <span className="icon">🛡️</span>
          <div>
            <strong style={{ color: 'var(--text)', fontSize: '0.8rem' }}>What we see: nothing.</strong>
            <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem' }}>
              All computation happens in your browser using zero-knowledge cryptography.
              No personal data leaves your device — ever.
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
