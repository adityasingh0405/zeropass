/**
 * ZeroPass — Global proof state context.
 * Shares the generated (or demo) proof across the Proof → Result pages.
 */
import React, { createContext, useContext, useState } from 'react'

export type CredentialType = 'age_18+' | 'aadhaar_identity'

export interface ProofState {
  credentialType: CredentialType | null
  proofHash: string | null
  isDemoMode: boolean
  isGenerating: boolean
}

interface ProofContextValue extends ProofState {
  setCredential: (type: CredentialType) => void
  setProofHash: (hash: string, demoMode?: boolean) => void
  setIsGenerating: (v: boolean) => void
  reset: () => void
}

const defaults: ProofState = {
  credentialType: null,
  proofHash: null,
  isDemoMode: false,
  isGenerating: false,
}

const ProofContext = createContext<ProofContextValue | null>(null)

export const ProofProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProofState>(defaults)

  const setCredential = (type: CredentialType) =>
    setState(s => ({ ...s, credentialType: type }))

  const setProofHash = (hash: string, demoMode = false) =>
    setState(s => ({ ...s, proofHash: hash, isDemoMode: demoMode, isGenerating: false }))

  const setIsGenerating = (v: boolean) =>
    setState(s => ({ ...s, isGenerating: v }))

  const reset = () => setState(defaults)

  return (
    <ProofContext.Provider value={{ ...state, setCredential, setProofHash, setIsGenerating, reset }}>
      {children}
    </ProofContext.Provider>
  )
}

export const useProof = (): ProofContextValue => {
  const ctx = useContext(ProofContext)
  if (!ctx) throw new Error('useProof must be used inside <ProofProvider>')
  return ctx
}
