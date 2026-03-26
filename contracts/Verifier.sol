// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZeroPass Verifier
 * @notice Records on-chain verification status for wallets that have completed
 *         a ZK proof (e.g., via Anon Aadhaar). Deployed on Polygon Amoy testnet.
 *
 * @dev Intentionally minimal — no access control on verify() to allow the
 *      demo mode to work without a backend signer. In production you would
 *      restrict who can call verify() (e.g., require an on-chain ZK verifier
 *      or a trusted backend signature).
 */
contract Verifier {
    // ── Storage ──────────────────────────────────────────────────────────────

    /// @notice Maps a wallet address to its verification status.
    mapping(address => bool) public isVerified;

    /// @notice Stores the credential type used for verification (e.g. "age", "aadhaar").
    mapping(address => string) public credentialType;

    // ── Events ────────────────────────────────────────────────────────────────

    event UserVerified(address indexed user, string credentialType, uint256 timestamp);

    // ── Write functions ───────────────────────────────────────────────────────

    /**
     * @notice Mark a wallet address as verified with the given credential type.
     * @param user           The wallet address to verify.
     * @param _credentialType A short string describing the credential (e.g. "age_18+").
     */
    function verify(address user, string calldata _credentialType) external {
        isVerified[user] = true;
        credentialType[user] = _credentialType;
        emit UserVerified(user, _credentialType, block.timestamp);
    }

    // ── Read functions ────────────────────────────────────────────────────────

    /**
     * @notice Check whether a wallet address has been verified.
     * @param user The wallet address to query.
     * @return True if the address has been verified.
     */
    function checkVerification(address user) external view returns (bool) {
        return isVerified[user];
    }

    /**
     * @notice Returns the credential type stored for a wallet.
     * @param user The wallet address to query.
     * @return The credential type string.
     */
    function getCredentialType(address user) external view returns (string memory) {
        return credentialType[user];
    }
}
