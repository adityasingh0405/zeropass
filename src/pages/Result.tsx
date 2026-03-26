/**
 * Result — Final page after successful proof generation.
 *
 * Shows the verified credential and wallet address.
 * "Submit On-Chain" button calls Verifier.verify() on Polygon Amoy via wagmi.
 * After the transaction is confirmed, shows the Polygonscan Amoy link.
 *
 * Guards: redirects to / if not connected, to /verify if no credential,
 *         or to /proof if no proof hash yet.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useProof } from '../context/ProofContext'
import { VERIFIER_ADDRESS, VERIFIER_ABI, AMOY_EXPLORER } from '../config/wagmi'

// ── Helpers ───────────────────────────────────────────────────────────────

function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + '…' + addr.slice(-4)
}

function shortenHash(hash: string | null): string {
  if (!hash) return ''
  return hash.slice(0, 10) + '…' + hash.slice(-8)
}

const LABEL_MAP: Record<string, { icon: string; label: string }> = {
  'age_18+': { icon: '🎂', label: 'Age Verification (18+)' },
  'aadhaar_identity': { icon: '🇮🇳', label: 'Aadhaar Identity' },
}

// ── Component ─────────────────────────────────────────────────────────────

export default function Result() {
  const { isConnected, address } = useAccount()
  const navigate = useNavigate()
  const { credentialType, proofHash, isDemoMode, reset } = useProof()

  // wagmi hook for calling the contract
  const { writeContract, data: txHash, isPending: isSigning, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const [submitError, setSubmitError] = useState<string | null>(null)

  // Guards
  useEffect(() => {
    if (!isConnected) navigate('/')
    else if (!credentialType) navigate('/verify')
    else if (!proofHash) navigate('/proof')
  }, [isConnected, credentialType, proofHash, navigate])

  const meta = credentialType ? LABEL_MAP[credentialType] : { icon: '✓', label: 'Verified' }

  // ── On-chain submission ───────────────────────────────────────────────
  function handleSubmitOnChain() {
    if (!address) return
    setSubmitError(null)

    try {
      writeContract({
        address: VERIFIER_ADDRESS,
        abi: VERIFIER_ABI,
        functionName: 'verify',
        args: [address, credentialType ?? 'unknown'],
      })
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Transaction failed. Please try again.')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <main className="page" style={{ paddingTop: '6rem' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Step badge */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>Step 3 of 3</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Proof verified ✓
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Your zero-knowledge proof was successfully generated.
            Record it on-chain to get an on-chain attestation.
          </p>
        </div>

        {/* Verified credential card */}
        <div className="card fade-up-delay-1" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)',
              border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
            }}>
              {meta.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{meta.label}</div>
              <span className="badge badge-green" style={{ marginTop: '0.25rem' }}>
                ✓ Verified
              </span>
              {isDemoMode && (
                <span className="badge" style={{ marginTop: '0.25rem', marginLeft: '0.5rem', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                  Demo
                </span>
              )}
            </div>
          </div>

          {/* Wallet address */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wallet</span>
            <span style={{
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              background: 'var(--bg-elevated)',
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
            }}>
              {address ? shortenAddress(address) : '—'}
            </span>
          </div>

          {/* Proof hash */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Proof hash</div>
            <div className="hash-box">
              {proofHash ?? '—'}
            </div>
          </div>

          {/* Chain */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Network</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-light)' }}>Polygon Amoy</span>
          </div>
        </div>

        {/* On-chain submission */}
        {!isConfirmed ? (
          <div className="card fade-up-delay-2" style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                📝 Record on-chain
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                This writes your verification status to the ZeroPass contract on Polygon Amoy.
                You'll need a small amount of test MATIC.
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleSubmitOnChain}
              disabled={isSigning || isConfirming}
            >
              {isSigning
                ? '⏳ Waiting for signature…'
                : isConfirming
                  ? '⛓ Confirming on-chain…'
                  : '🔗 Submit On-Chain'}
            </button>

            {/* Write error */}
            {(writeError || submitError) && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '0.8rem',
                color: 'var(--error)',
              }}>
                ⚠ {submitError ?? writeError?.message ?? 'Transaction failed'}
              </div>
            )}

            {/* Faucet hint */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              Need test MATIC?{' '}
              <a
                href="https://faucet.polygon.technology"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-light)' }}
              >
                faucet.polygon.technology ↗
              </a>
            </p>
          </div>
        ) : (
          /* ── Success: transaction confirmed ─────────────────────────── */
          <div className="card fade-up" style={{ marginBottom: '1rem', borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--success)' }}>
                On-chain verified!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Your verification is now permanently recorded on Polygon Amoy.
              </p>
              <a
                href={`${AMOY_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                View on Polygonscan ↗
              </a>

              {/* Tx hash */}
              {txHash && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Transaction hash
                  </div>
                  <div className="hash-box">{shortenHash(txHash)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Privacy box */}
        <div className="privacy-box fade-up-delay-3">
          <span className="icon">🛡️</span>
          <div style={{ fontSize: '0.78rem' }}>
            <strong style={{ color: 'var(--text)' }}>What got proved:</strong>{' '}
            {credentialType === 'age_18+' ? 'You are 18 or older.' : 'Your Aadhaar is valid.'}{' '}
            <strong style={{ color: 'var(--text)' }}>What was revealed:</strong> Nothing — only a cryptographic proof.
          </div>
        </div>

        {/* Reset */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            className="btn btn-outline"
            style={{ fontSize: '0.8rem' }}
            onClick={() => { reset(); navigate('/') }}
          >
            ← Start over
          </button>
        </div>
      </div>
    </main>
  )
}
