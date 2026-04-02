# n8n-nodes-circle-usdc

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for Circle USDC operations, enabling seamless integration with Circle's programmable wallet infrastructure and USDC stablecoin management. This node provides 7 comprehensive resources covering wallet management, transfers, addresses, transactions, balances, cross-chain transfers, and configuration operations for building robust Web3 financial applications.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![USDC](https://img.shields.io/badge/USDC-Stablecoin-green)
![Circle](https://img.shields.io/badge/Circle-Web3-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum%20%7C%20Polygon-orange)

## Features

- **Programmable Wallets** - Create and manage Circle programmable wallets with multi-signature support
- **USDC Transfers** - Execute secure USDC transfers with real-time transaction tracking
- **Address Management** - Generate and validate blockchain addresses across supported networks
- **Transaction Monitoring** - Track transaction status, confirmations, and blockchain events
- **Balance Inquiries** - Query USDC balances across multiple wallets and addresses
- **Cross-Chain Transfers (CCTP)** - Leverage Circle's Cross-Chain Transfer Protocol for seamless multi-chain operations
- **Configuration Management** - Configure webhooks, notifications, and API settings
- **Enterprise Security** - API key authentication with comprehensive error handling and validation

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-circle-usdc`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-circle-usdc
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-circle-usdc.git
cd n8n-nodes-circle-usdc
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-circle-usdc
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Circle API key for authentication | Yes |
| Environment | Production or Sandbox environment | Yes |
| API Version | Circle API version (default: v1) | No |

## Resources & Operations

### 1. Wallet

| Operation | Description |
|-----------|-------------|
| Create | Create a new programmable wallet |
| Get | Retrieve wallet details by ID |
| List | List all wallets in your account |
| Update | Update wallet configuration |
| Delete | Delete a wallet |

### 2. Transfer

| Operation | Description |
|-----------|-------------|
| Create | Initiate a USDC transfer |
| Get | Retrieve transfer details by ID |
| List | List all transfers with filtering options |
| Cancel | Cancel a pending transfer |
| Estimate Fees | Calculate transfer fees before execution |

### 3. Address

| Operation | Description |
|-----------|-------------|
| Create | Generate a new blockchain address |
| Get | Retrieve address details |
| List | List addresses for a wallet |
| Validate | Validate blockchain address format |

### 4. Transaction

| Operation | Description |
|-----------|-------------|
| Get | Retrieve transaction details by hash |
| List | List transactions with filtering |
| Get Status | Check transaction confirmation status |
| Get Receipt | Retrieve transaction receipt |

### 5. Balance

| Operation | Description |
|-----------|-------------|
| Get Wallet Balance | Get USDC balance for a specific wallet |
| Get Address Balance | Get balance for a specific address |
| List All Balances | List balances across all wallets |
| Get Token Balances | Get balances for specific token types |

### 6. CctpTransfer

| Operation | Description |
|-----------|-------------|
| Create | Initiate cross-chain transfer via CCTP |
| Get | Retrieve CCTP transfer details |
| List | List cross-chain transfers |
| Get Attestation | Retrieve transfer attestation |
| Complete Transfer | Complete cross-chain transfer on destination chain |

### 7. Configuration

| Operation | Description |
|-----------|-------------|
| Get Settings | Retrieve current API configuration |
| Update Webhooks | Configure webhook endpoints |
| List Supported Chains | Get supported blockchain networks |
| Get Rate Limits | Check API rate limit status |

## Usage Examples

```javascript
// Create a new programmable wallet
{
  "name": "Business Wallet",
  "description": "Primary wallet for business operations",
  "walletSetId": "01234567-89ab-cdef-0123-456789abcdef"
}
```

```javascript
// Execute USDC transfer
{
  "source": {
    "type": "wallet",
    "id": "01234567-89ab-cdef-0123-456789abcdef"
  },
  "destination": {
    "type": "blockchain",
    "address": "0x742F5dC7A7d1c1E69a3F3E3F9c8A5b1c2D3e4F5G",
    "chain": "ETH"
  },
  "amounts": ["100.50"],
  "tokenId": "26a57453-0435-4d3f-b98a-55a6c5b8efc5"
}
```

```javascript
// Initiate cross-chain transfer
{
  "source": {
    "type": "wallet",
    "id": "01234567-89ab-cdef-0123-456789abcdef"
  },
  "destination": {
    "type": "blockchain",
    "address": "0x742F5dC7A7d1c1E69a3F3E3F9c8A5b1c2D3e4F5G",
    "chain": "MATIC"
  },
  "amount": {
    "amount": "1000.00"
  },
  "sourceChain": "ETH",
  "destinationChain": "MATIC"
}
```

```javascript
// Query wallet balance
{
  "walletId": "01234567-89ab-cdef-0123-456789abcdef",
  "tokenAddress": "0xA0b86a33E6441fE4fb34aBd8Acf56fd1a16Bb5a8",
  "includeAll": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials |
| 404 Not Found | Wallet, transfer, or resource not found | Check resource ID exists |
| 400 Bad Request | Invalid request parameters | Validate input data format |
| 429 Rate Limited | Too many API requests | Implement retry logic with delays |
| 500 Internal Error | Circle API server error | Retry request after delay |
| Insufficient Balance | Not enough USDC for transfer | Check wallet balance before transfer |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-circle-usdc/issues)
- **Circle Developer Docs**: [Circle API Documentation](https://developers.circle.com/)
- **Circle Community**: [Circle Developer Discord](https://discord.gg/circle-developers)