/**
 * wagmi + RainbowKit configuration for ZeroPass.
 * Targets Polygon Amoy testnet (chainId: 80002) as the primary chain.
 */
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy } from 'wagmi/chains'

// WalletConnect Project ID — for production replace with your own from cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = 'zeropass_demo_project_id'

export const wagmiConfig = getDefaultConfig({
  appName: 'ZeroPass',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [polygonAmoy],
  ssr: false,
})

// ── Contract config ───────────────────────────────────────────────────────
// Address of the deployed Verifier.sol on Polygon Amoy.
// Replace this with your actual deployed address after running the deployment script.
export const VERIFIER_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`

// Simplified ABI — only the functions we need in the frontend
export const VERIFIER_ABI = [
  {
    name: 'verify',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: '_credentialType', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'checkVerification',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'getCredentialType',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

// ── Block explorer ────────────────────────────────────────────────────────
export const AMOY_EXPLORER = 'https://amoy.polygonscan.com'
export const AMOY_RPC = 'https://rpc-amoy.polygon.technology'
