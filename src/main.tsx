/**
 * ZeroPass — Application entry point.
 * Sets up all providers: QueryClient, wagmi, RainbowKit, AnonAadhaar, Router.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { AnonAadhaarProvider } from '@anon-aadhaar/react'

import { wagmiConfig } from './config/wagmi'
import { ProofProvider } from './context/ProofContext'
import App from './App'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#7c3aed',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {/* AnonAadhaarProvider gates ZK proof generation. Using test mode. */}
          <AnonAadhaarProvider _useTestAadhaar={true}>
            <ProofProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ProofProvider>
          </AnonAadhaarProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
