/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-circleusdc/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CircleUSDC implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Circle USDC',
    name: 'circleusdc',
    icon: 'file:circleusdc.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Circle USDC API',
    defaults: {
      name: 'Circle USDC',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'circleusdcApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Wallet',
            value: 'wallet',
          },
          {
            name: 'Transfer',
            value: 'transfer',
          },
          {
            name: 'Address',
            value: 'address',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Balance',
            value: 'balance',
          },
          {
            name: 'CctpTransfer',
            value: 'cctpTransfer',
          },
          {
            name: 'Configuration',
            value: 'configuration',
          }
        ],
        default: 'wallet',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['wallet'] } },
  options: [
    { name: 'Create Wallet', value: 'createWallet', description: 'Create a new wallet', action: 'Create wallet' },
    { name: 'Get Wallet', value: 'getWallet', description: 'Get wallet details', action: 'Get wallet' },
    { name: 'List Wallets', value: 'listWallets', description: 'List all wallets', action: 'List wallets' }
  ],
  default: 'createWallet',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transfer'] } },
  options: [
    { name: 'Create Transfer', value: 'createTransfer', description: 'Create a new transfer', action: 'Create a transfer' },
    { name: 'Get Transfer', value: 'getTransfer', description: 'Get transfer details', action: 'Get a transfer' },
    { name: 'List Transfers', value: 'listTransfers', description: 'List transfers', action: 'List transfers' }
  ],
  default: 'createTransfer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['address'] } },
  options: [
    { name: 'Create Address', value: 'createAddress', description: 'Generate new blockchain address', action: 'Create address' },
    { name: 'List Addresses', value: 'listAddresses', description: 'List addresses for a wallet', action: 'List addresses' },
  ],
  default: 'createAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details by ID', action: 'Get transaction details' },
    { name: 'List Transactions', value: 'listTransactions', description: 'List transactions with optional filters', action: 'List transactions' },
    { name: 'Estimate Transfer', value: 'estimateTransfer', description: 'Estimate transfer fees for a transaction', action: 'Estimate transfer fees' }
  ],
  default: 'getTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['balance'],
		},
	},
	options: [
		{
			name: 'Get Wallet Balances',
			value: 'getWalletBalances',
			description: 'Get wallet balances',
			action: 'Get wallet balances',
		},
		{
			name: 'Get Address Balances',
			value: 'getAddressBalances',
			description: 'Get address balances',
			action: 'Get address balances',
		},
	],
	default: 'getWalletBalances',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['cctpTransfer'] } },
  options: [
    { name: 'Create CCTP Transfer', value: 'createCctpTransfer', description: 'Create cross-chain USDC transfer', action: 'Create CCTP transfer' },
    { name: 'Get CCTP Transfer', value: 'getCctpTransfer', description: 'Get CCTP transfer details', action: 'Get CCTP transfer' },
    { name: 'List CCTP Transfers', value: 'listCctpTransfers', description: 'List CCTP transfers', action: 'List CCTP transfers' }
  ],
  default: 'createCctpTransfer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['configuration'] } },
  options: [
    { name: 'Get Configuration', value: 'getConfiguration', description: 'Get API configuration and supported chains', action: 'Get API configuration' },
    { name: 'Create Subscription', value: 'createSubscription', description: 'Create webhook subscription', action: 'Create webhook subscription' },
    { name: 'List Subscriptions', value: 'listSubscriptions', description: 'List webhook subscriptions', action: 'List webhook subscriptions' },
    { name: 'Update Subscription', value: 'updateSubscription', description: 'Update webhook subscription', action: 'Update webhook subscription' },
    { name: 'Delete Subscription', value: 'deleteSubscription', description: 'Delete webhook subscription', action: 'Delete webhook subscription' },
  ],
  default: 'getConfiguration',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['createWallet']
    }
  },
  default: '',
  description: 'Idempotency key to ensure request is processed only once'
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getWallet']
    }
  },
  default: '',
  description: 'The ID of the wallet to retrieve'
},
{
  displayName: 'From',
  name: 'from',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['listWallets']
    }
  },
  default: '',
  description: 'Queries items created on or after this date'
},
{
  displayName: 'To',
  name: 'to',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['listWallets']
    }
  },
  default: '',
  description: 'Queries items created on or before this date'
},
{
  displayName: 'Page Before',
  name: 'pageBefore',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['listWallets']
    }
  },
  default: '',
  description: 'Cursor for pagination (before)'
},
{
  displayName: 'Page After',
  name: 'pageAfter',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['listWallets']
    }
  },
  default: '',
  description: 'Cursor for pagination (after)'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['listWallets']
    }
  },
  default: 50,
  description: 'Number of items to return per page'
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createTransfer'] } },
  default: '',
  description: 'Universally unique identifier for idempotency'
},
{
  displayName: 'Source',
  name: 'source',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createTransfer'] } },
  default: '{"type": "wallet", "id": ""}',
  description: 'Source wallet or blockchain address object'
},
{
  displayName: 'Destination',
  name: 'destination',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createTransfer'] } },
  default: '{"type": "wallet", "id": ""}',
  description: 'Destination wallet or blockchain address object'
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createTransfer'] } },
  default: '',
  description: 'Transfer amount as a decimal string'
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createTransfer'] } },
  options: [
    { name: 'USDC', value: 'USD' },
    { name: 'EURC', value: 'EUR' }
  ],
  default: 'USD',
  description: 'Currency for the transfer'
},
{
  displayName: 'Transfer ID',
  name: 'transferId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['getTransfer'] } },
  default: '',
  description: 'Unique identifier for the transfer'
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'Filter by wallet ID'
},
{
  displayName: 'Source Wallet ID',
  name: 'sourceWalletId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'Filter by source wallet ID'
},
{
  displayName: 'Destination Wallet ID',
  name: 'destinationWalletId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'Filter by destination wallet ID'
},
{
  displayName: 'Return Identities',
  name: 'returnIdentities',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: false,
  description: 'Whether to return wallet identities'
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'Start date for filtering transfers'
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'End date for filtering transfers'
},
{
  displayName: 'Page Before',
  name: 'pageBefore',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'Cursor for pagination before'
},
{
  displayName: 'Page After',
  name: 'pageAfter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: '',
  description: 'Cursor for pagination after'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['transfer'], operation: ['listTransfers'] } },
  default: 10,
  description: 'Number of results per page'
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['address'], operation: ['createAddress', 'listAddresses'] } },
  default: '',
  description: 'The unique identifier for the wallet',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['address'], operation: ['createAddress'] } },
  default: '',
  description: 'Unique identifier for idempotent request handling',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['address'], operation: ['createAddress'] } },
  options: [
    { name: 'USD', value: 'USD' },
    { name: 'EUR', value: 'EUR' },
    { name: 'BTC', value: 'BTC' },
    { name: 'ETH', value: 'ETH' },
  ],
  default: 'USD',
  description: 'Currency for the address',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['address'], operation: ['createAddress'] } },
  options: [
    { name: 'Ethereum', value: 'ETH' },
    { name: 'Bitcoin', value: 'BTC' },
    { name: 'Polygon', value: 'MATIC' },
    { name: 'Avalanche', value: 'AVAX' },
  ],
  default: 'ETH',
  description: 'Blockchain network for the address',
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['address'], operation: ['listAddresses'] } },
  default: '',
  description: 'Start date for filtering addresses',
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['address'], operation: ['listAddresses'] } },
  default: '',
  description: 'End date for filtering addresses',
},
{
  displayName: 'Page Before',
  name: 'pageBefore',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['address'], operation: ['listAddresses'] } },
  default: '',
  description: 'Cursor for pagination (before)',
},
{
  displayName: 'Page After',
  name: 'pageAfter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['address'], operation: ['listAddresses'] } },
  default: '',
  description: 'Cursor for pagination (after)',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['address'], operation: ['listAddresses'] } },
  default: 10,
  typeOptions: { minValue: 1, maxValue: 50 },
  description: 'Number of items per page',
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction'] } },
  default: '',
  description: 'The unique identifier of the transaction'
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions', 'estimateTransfer'] } },
  default: '',
  description: 'Filter by wallet ID'
},
{
  displayName: 'Source Address',
  name: 'sourceAddress',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'Filter by source address'
},
{
  displayName: 'Destination Address',
  name: 'destinationAddress',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions', 'estimateTransfer'] } },
  default: '',
  description: 'Filter by or specify destination address'
},
{
  displayName: 'Include All',
  name: 'includeAll',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: false,
  description: 'Include all transaction types'
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'dateTime',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'Start date for filtering transactions'
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'dateTime',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'End date for filtering transactions'
},
{
  displayName: 'Page Before',
  name: 'pageBefore',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'A collection ID value used for pagination'
},
{
  displayName: 'Page After',
  name: 'pageAfter',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: '',
  description: 'A collection ID value used for pagination'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
  default: 50,
  description: 'Number of results per page'
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['estimateTransfer'] } },
  default: '',
  description: 'The token contract address for the transfer'
},
{
  displayName: 'Amounts',
  name: 'amounts',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['estimateTransfer'] } },
  default: '',
  description: 'Comma-separated list of amounts to transfer'
},
{
  displayName: 'Fee Level',
  name: 'feeLevel',
  type: 'options',
  displayOptions: { show: { resource: ['transaction'], operation: ['estimateTransfer'] } },
  options: [
    { name: 'Low', value: 'LOW' },
    { name: 'Medium', value: 'MEDIUM' },
    { name: 'High', value: 'HIGH' }
  ],
  default: 'MEDIUM',
  description: 'The fee level for the transaction'
},
{
	displayName: 'Wallet ID',
	name: 'walletId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['balance'],
			operation: ['getWalletBalances'],
		},
	},
	default: '',
	description: 'The unique identifier for the wallet',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['balance'],
			operation: ['getAddressBalances'],
		},
	},
	default: '',
	description: 'The blockchain address to get balances for',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['createCctpTransfer'] } },
  default: '',
  description: 'Unique identifier to ensure operation idempotency'
},
{
  displayName: 'Source Wallet ID',
  name: 'source',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['createCctpTransfer'] } },
  default: '',
  description: 'Source wallet identifier'
},
{
  displayName: 'Destination Address',
  name: 'destination',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['createCctpTransfer'] } },
  default: '',
  description: 'Destination wallet address'
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['createCctpTransfer'] } },
  default: '',
  description: 'Amount to transfer in USDC'
},
{
  displayName: 'Attestation Hash',
  name: 'attestationHash',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['createCctpTransfer'] } },
  default: '',
  description: 'Attestation hash for the transfer'
},
{
  displayName: 'Transfer ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['getCctpTransfer'] } },
  default: '',
  description: 'CCTP transfer ID'
},
{
  displayName: 'Source Wallet ID',
  name: 'sourceWalletId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Filter by source wallet ID'
},
{
  displayName: 'Destination Address',
  name: 'destinationAddress',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Filter by destination address'
},
{
  displayName: 'Source Chain',
  name: 'sourceChain',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Filter by source chain'
},
{
  displayName: 'Destination Chain',
  name: 'destinationChain',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Filter by destination chain'
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Start date for filtering transfers'
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'End date for filtering transfers'
},
{
  displayName: 'Page Before',
  name: 'pageBefore',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Cursor for previous page'
},
{
  displayName: 'Page After',
  name: 'pageAfter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: '',
  description: 'Cursor for next page'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['cctpTransfer'], operation: ['listCctpTransfers'] } },
  default: 10,
  description: 'Number of items per page'
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['configuration'], operation: ['createSubscription'] } },
  default: '',
  description: 'Unique identifier for idempotent request handling',
},
{
  displayName: 'Endpoint URL',
  name: 'endpoint',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['configuration'], operation: ['createSubscription', 'updateSubscription'] } },
  default: '',
  description: 'The webhook endpoint URL that will receive notifications',
},
{
  displayName: 'Subscription Events',
  name: 'subscriptions',
  type: 'collection',
  placeholder: 'Add Subscription',
  required: true,
  displayOptions: { show: { resource: ['configuration'], operation: ['createSubscription', 'updateSubscription'] } },
  default: {},
  options: [
    {
      displayName: 'Subscription Type',
      name: 'subscriptionType',
      type: 'options',
      options: [
        { name: 'Payments', value: 'payments' },
        { name: 'Transfers', value: 'transfers' },
        { name: 'Addresses', value: 'addresses' },
        { name: 'Settlements', value: 'settlements' },
        { name: 'Cards', value: 'cards' },
        { name: 'ACH', value: 'ach' },
        { name: 'Wire', value: 'wire' },
      ],
      default: 'payments',
      description: 'Type of events to subscribe to',
    },
  ],
  description: 'Event subscriptions configuration',
},
{
  displayName: 'Subscription ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['configuration'], operation: ['updateSubscription', 'deleteSubscription'] } },
  default: '',
  description: 'The subscription ID to update or delete',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'wallet':
        return [await executeWalletOperations.call(this, items)];
      case 'transfer':
        return [await executeTransferOperations.call(this, items)];
      case 'address':
        return [await executeAddressOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'balance':
        return [await executeBalanceOperations.call(this, items)];
      case 'cctpTransfer':
        return [await executeCctpTransferOperations.call(this, items)];
      case 'configuration':
        return [await executeConfigurationOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeWalletOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('circleusdcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createWallet': {
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/wallets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Idempotency-Key': idempotencyKey
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getWallet': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/wallets/${walletId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'listWallets': {
          const queryParams: any = {};
          
          const from = this.getNodeParameter('from', i, '') as string;
          const to = this.getNodeParameter('to', i, '') as string;
          const pageBefore = this.getNodeParameter('pageBefore', i, '') as string;
          const pageAfter = this.getNodeParameter('pageAfter', i, '') as string;
          const pageSize = this.getNodeParameter('pageSize', i, 50) as number;
          
          if (from) queryParams.from = from;
          if (to) queryParams.to = to;
          if (pageBefore) queryParams.pageBefore = pageBefore;
          if (pageAfter) queryParams.pageAfter = pageAfter;
          if (pageSize) queryParams.pageSize = pageSize;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/wallets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: queryParams,
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransferOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('circleusdcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createTransfer': {
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          const source = this.getNodeParameter('source', i) as any;
          const destination = this.getNodeParameter('destination', i) as any;
          const amount = this.getNodeParameter('amount', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;

          const body = {
            idempotencyKey,
            source,
            destination,
            amount: {
              amount,
              currency
            }
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/transfers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true,
            body
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransfer': {
          const transferId = this.getNodeParameter('transferId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/transfers/${transferId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listTransfers': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const sourceWalletId = this.getNodeParameter('sourceWalletId', i) as string;
          const destinationWalletId = this.getNodeParameter('destinationWalletId', i) as string;
          const returnIdentities = this.getNodeParameter('returnIdentities', i) as boolean;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const pageBefore = this.getNodeParameter('pageBefore', i) as string;
          const pageAfter = this.getNodeParameter('pageAfter', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;

          const queryParams: any = {};
          if (walletId) queryParams.walletId = walletId;
          if (sourceWalletId) queryParams.sourceWalletId = sourceWalletId;
          if (destinationWalletId) queryParams.destinationWalletId = destinationWalletId;
          if (returnIdentities) queryParams.returnIdentities = returnIdentities;
          if (from) queryParams.from = from;
          if (to) queryParams.to = to;
          if (pageBefore) queryParams.pageBefore = pageBefore;
          if (pageAfter) queryParams.pageAfter = pageAfter;
          if (pageSize) queryParams.pageSize = pageSize;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/v1/transfers${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAddressOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('circleusdcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createAddress': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;

          const body = {
            idempotencyKey,
            currency,
            chain,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/wallets/${walletId}/addresses`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAddresses': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const from = this.getNodeParameter('from', i, '') as string;
          const to = this.getNodeParameter('to', i, '') as string;
          const pageBefore = this.getNodeParameter('pageBefore', i, '') as string;
          const pageAfter = this.getNodeParameter('pageAfter', i, '') as string;
          const pageSize = this.getNodeParameter('pageSize', i, 10) as number;

          const queryParams: any = {};
          if (from) queryParams.from = from;
          if (to) queryParams.to = to;
          if (pageBefore) queryParams.pageBefore = pageBefore;
          if (pageAfter) queryParams.pageAfter = pageAfter;
          if (pageSize) queryParams.pageSize = pageSize.toString();

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/v1/wallets/${walletId}/addresses${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('circleusdcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTransaction': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/transactions/${transactionId}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listTransactions': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const sourceAddress = this.getNodeParameter('sourceAddress', i) as string;
          const destinationAddress = this.getNodeParameter('destinationAddress', i) as string;
          const includeAll = this.getNodeParameter('includeAll', i) as boolean;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const pageBefore = this.getNodeParameter('pageBefore', i) as string;
          const pageAfter = this.getNodeParameter('pageAfter', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;

          const params = new URLSearchParams();
          if (walletId) params.append('walletId', walletId);
          if (sourceAddress) params.append('sourceAddress', sourceAddress);
          if (destinationAddress) params.append('destinationAddress', destinationAddress);
          if (includeAll) params.append('includeAll', 'true');
          if (from) params.append('from', from);
          if (to) params.append('to', to);
          if (pageBefore) params.append('pageBefore', pageBefore);
          if (pageAfter) params.append('pageAfter', pageAfter);
          if (pageSize) params.append('pageSize', pageSize.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/transactions${params.toString() ? '?' + params.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateTransfer': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          const destinationAddress = this.getNodeParameter('destinationAddress', i) as string;
          const amounts = this.getNodeParameter('amounts', i) as string;
          const feeLevel = this.getNodeParameter('feeLevel', i) as string;

          const body: any = {
            walletId,
            tokenAddress,
            destinationAddress,
            amounts: amounts.split(',').map((amount: string) => amount.trim()),
            feeLevel,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/transactions/transfer`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBalanceOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('circleusdcApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getWalletBalances': {
					const walletId = this.getNodeParameter('walletId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v1/wallets/${walletId}/balances`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getAddressBalances': {
					const address = this.getNodeParameter('address', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v1/addresses/${address}/balances`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i }
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCctpTransferOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('circleusdcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createCctpTransfer': {
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          const source = this.getNodeParameter('source', i) as string;
          const destination = this.getNodeParameter('destination', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const attestationHash = this.getNodeParameter('attestationHash', i) as string;

          const body: any = {
            source,
            destination,
            amount
          };

          if (attestationHash) {
            body.attestationHash = attestationHash;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/w3s/transfers`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
              'X-Idempotency-Key': idempotencyKey
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCctpTransfer': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/w3s/transfers/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listCctpTransfers': {
          const sourceWalletId = this.getNodeParameter('sourceWalletId', i) as string;
          const destinationAddress = this.getNodeParameter('destinationAddress', i) as string;
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const pageBefore = this.getNodeParameter('pageBefore', i) as string;
          const pageAfter = this.getNodeParameter('pageAfter', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;

          const params: string[] = [];
          if (sourceWalletId) params.push(`sourceWalletId=${encodeURIComponent(sourceWalletId)}`);
          if (destinationAddress) params.push(`destinationAddress=${encodeURIComponent(destinationAddress)}`);
          if (sourceChain) params.push(`sourceChain=${encodeURIComponent(sourceChain)}`);
          if (destinationChain) params.push(`destinationChain=${encodeURIComponent(destinationChain)}`);
          if (from) params.push(`from=${encodeURIComponent(from)}`);
          if (to) params.push(`to=${encodeURIComponent(to)}`);
          if (pageBefore) params.push(`pageBefore=${encodeURIComponent(pageBefore)}`);
          if (pageAfter) params.push(`pageAfter=${encodeURIComponent(pageAfter)}`);
          if (pageSize) params.push(`pageSize=${pageSize}`);

          const queryString = params.length > 0 ? `?${params.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/w3s/transfers${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeConfigurationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('circleusdcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getConfiguration': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/configuration`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSubscription': {
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          const endpoint = this.getNodeParameter('endpoint', i) as string;
          const subscriptions = this.getNodeParameter('subscriptions', i) as any;

          const body: any = {
            endpoint,
            subscriptions: subscriptions.subscriptionType ? [subscriptions.subscriptionType] : [],
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/subscriptions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Request-Id': idempotencyKey,
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listSubscriptions': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/subscriptions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSubscription': {
          const id = this.getNodeParameter('id', i) as string;
          const endpoint = this.getNodeParameter('endpoint', i) as string;
          const subscriptions = this.getNodeParameter('subscriptions', i) as any;

          const body: any = {
            endpoint,
            subscriptions: subscriptions.subscriptionType ? [subscriptions.subscriptionType] : [],
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v1/subscriptions/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteSubscription': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v1/subscriptions/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
