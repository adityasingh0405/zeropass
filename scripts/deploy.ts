// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ethers } = require('hardhat')

/**
 * Deployment script for Verifier.sol on Polygon Amoy.
 *
 * Prerequisites:
 *   1. Copy .env.example → .env and set your PRIVATE_KEY
 *   2. Fund the deployer wallet with Amoy test MATIC:
 *      https://faucet.polygon.technology
 *
 * Run:
 *   npx hardhat run scripts/deploy.ts --network amoy
 *
 * After deployment:
 *   - Copy the printed contract address
 *   - Paste it into src/config/wagmi.ts as VERIFIER_ADDRESS
 */
async function main() {
  console.log('🚀 Deploying Verifier.sol to Polygon Amoy…')

  const [deployer] = await ethers.getSigners()
  console.log(`   Deployer: ${deployer.address}`)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`   Balance:  ${ethers.formatEther(balance)} MATIC`)

  if (balance === 0n) {
    console.error('\n❌ Deployer has no MATIC. Get test MATIC at https://faucet.polygon.technology')
    process.exit(1)
  }

  // Deploy the Verifier contract
  const Verifier = await ethers.getContractFactory('Verifier')
  const verifier = await Verifier.deploy()
  await verifier.waitForDeployment()

  const address = await verifier.getAddress()
  console.log(`\n✅ Verifier deployed at: ${address}`)
  console.log(`   Polygonscan:          https://amoy.polygonscan.com/address/${address}`)
  console.log('\n📋 Next step: paste this address into src/config/wagmi.ts as VERIFIER_ADDRESS')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
