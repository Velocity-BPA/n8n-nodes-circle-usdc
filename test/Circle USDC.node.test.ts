/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CircleUSDC } from '../nodes/Circle USDC/Circle USDC.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CircleUSDC Node', () => {
  let node: CircleUSDC;

  beforeAll(() => {
    node = new CircleUSDC();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Circle USDC');
      expect(node.description.name).toBe('circleusdc');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Wallet Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.circle.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Circle USDC Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('createWallet operation', () => {
    it('should create a wallet successfully', async () => {
      const mockResponse = {
        data: {
          walletId: 'wallet-123',
          entityId: 'entity-456',
          type: 'end_user_wallet'
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createWallet')
        .mockReturnValueOnce('test-idempotency-key');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.circle.com/v1/wallets',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Idempotency-Key': 'test-idempotency-key'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle createWallet errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createWallet')
        .mockReturnValueOnce('test-idempotency-key');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getWallet operation', () => {
    it('should get wallet details successfully', async () => {
      const mockResponse = {
        data: {
          walletId: 'wallet-123',
          entityId: 'entity-456',
          type: 'end_user_wallet',
          balances: []
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getWallet')
        .mockReturnValueOnce('wallet-123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.circle.com/v1/wallets/wallet-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getWallet errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getWallet')
        .mockReturnValueOnce('wallet-123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Wallet not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Wallet not found' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('listWallets operation', () => {
    it('should list wallets successfully', async () => {
      const mockResponse = {
        data: [
          { walletId: 'wallet-1', type: 'end_user_wallet' },
          { walletId: 'wallet-2', type: 'end_user_wallet' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listWallets')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(50);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.circle.com/v1/wallets',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        qs: { pageSize: 50 },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle listWallets errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listWallets');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Unauthorized'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Unauthorized' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Transfer Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.circle.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('createTransfer', () => {
    it('should create a transfer successfully', async () => {
      const mockResponse = { data: { id: 'transfer-123', status: 'pending' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createTransfer')
        .mockReturnValueOnce('idempotency-123')
        .mockReturnValueOnce({ type: 'wallet', id: 'wallet-123' })
        .mockReturnValueOnce({ type: 'wallet', id: 'wallet-456' })
        .mockReturnValueOnce('100.00')
        .mockReturnValueOnce('USD');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle create transfer error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createTransfer');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getTransfer', () => {
    it('should get transfer details successfully', async () => {
      const mockResponse = { data: { id: 'transfer-123', amount: '100.00' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransfer')
        .mockReturnValueOnce('transfer-123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('listTransfers', () => {
    it('should list transfers successfully', async () => {
      const mockResponse = { data: [{ id: 'transfer-123' }, { id: 'transfer-456' }] };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listTransfers');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Address Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.circle.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('createAddress operation', () => {
    it('should create address successfully', async () => {
      const mockResponse = {
        data: {
          id: 'addr_123',
          address: '0x1234567890abcdef',
          currency: 'USD',
          chain: 'ETH'
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createAddress')
        .mockReturnValueOnce('wallet_123')
        .mockReturnValueOnce('idempotency_123')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce('ETH');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.circle.com/v1/wallets/wallet_123/addresses',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          idempotencyKey: 'idempotency_123',
          currency: 'USD',
          chain: 'ETH',
        },
      });
    });

    it('should handle createAddress error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createAddress')
        .mockReturnValueOnce('wallet_123')
        .mockReturnValueOnce('idempotency_123')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce('ETH');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('listAddresses operation', () => {
    it('should list addresses successfully', async () => {
      const mockResponse = {
        data: [{
          id: 'addr_123',
          address: '0x1234567890abcdef',
          currency: 'USD',
          chain: 'ETH'
        }]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listAddresses')
        .mockReturnValueOnce('wallet_123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(10);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle listAddresses error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listAddresses')
        .mockReturnValueOnce('wallet_123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        bearerToken: 'test-token', 
        baseUrl: 'https://api.circle.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get transaction details successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('txn_123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'txn_123',
      status: 'confirmed',
      amount: '100.00'
    });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('txn_123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.circle.com/v1/transactions/txn_123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should list transactions with filters', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listTransactions')
      .mockReturnValueOnce('wallet_123')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('0x456')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(50);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      data: [{ id: 'txn_1' }, { id: 'txn_2' }]
    });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.circle.com/v1/transactions?walletId=wallet_123&destinationAddress=0x456&pageSize=50',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should estimate transfer fees', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('estimateTransfer')
      .mockReturnValueOnce('wallet_123')
      .mockReturnValueOnce('0x789')
      .mockReturnValueOnce('0x456')
      .mockReturnValueOnce('100.00')
      .mockReturnValueOnce('MEDIUM');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      estimatedFee: '0.001',
      gasPrice: '20'
    });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.circle.com/v1/transactions/transfer',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: {
        walletId: 'wallet_123',
        tokenAddress: '0x789',
        destinationAddress: '0x456',
        amounts: ['100.00'],
        feeLevel: 'MEDIUM',
      },
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('invalid_id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));

    await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Transaction not found');
  });

  it('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('invalid_id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Balance Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.circle.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getWalletBalances', () => {
		it('should get wallet balances successfully', async () => {
			const mockResponse = {
				data: {
					balances: [
						{
							amount: '1000.00',
							currency: 'USDC',
						},
					],
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWalletBalances')
				.mockReturnValueOnce('wallet-123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBalanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.circle.com/v1/wallets/wallet-123/balances',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle errors when getting wallet balances', async () => {
			const mockError = new Error('Wallet not found');
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWalletBalances')
				.mockReturnValueOnce('invalid-wallet');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeBalanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('Wallet not found');
		});
	});

	describe('getAddressBalances', () => {
		it('should get address balances successfully', async () => {
			const mockResponse = {
				data: {
					balances: [
						{
							amount: '500.00',
							currency: 'USDC',
						},
					],
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressBalances')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBalanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.circle.com/v1/addresses/0x1234567890123456789012345678901234567890/balances',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle errors when getting address balances', async () => {
			const mockError = new Error('Address not found');
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressBalances')
				.mockReturnValueOnce('invalid-address');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeBalanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('Address not found');
		});
	});
});

describe('CctpTransfer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ bearerToken: 'test-token', baseUrl: 'https://api.circle.com' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should create CCTP transfer successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createCctpTransfer',
        idempotencyKey: 'test-key-123',
        source: 'wallet-123',
        destination: '0x123...abc',
        amount: '100.00',
        attestationHash: 'hash123'
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'transfer-123', status: 'pending' });

    const items = [{ json: {} }];
    const result = await executeCctpTransferOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ id: 'transfer-123', status: 'pending' });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.circle.com/v1/w3s/transfers',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Idempotency-Key': 'test-key-123'
      },
      body: {
        source: 'wallet-123',
        destination: '0x123...abc',
        amount: '100.00',
        attestationHash: 'hash123'
      },
      json: true
    });
  });

  it('should get CCTP transfer successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getCctpTransfer',
        id: 'transfer-123'
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'transfer-123', status: 'complete' });

    const items = [{ json: {} }];
    const result = await executeCctpTransferOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ id: 'transfer-123', status: 'complete' });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.circle.com/v1/w3s/transfers/transfer-123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  it('should list CCTP transfers successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'listCctpTransfers',
        sourceWalletId: 'wallet-123',
        pageSize: 10
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: [{ id: 'transfer-1' }] });

    const items = [{ json: {} }];
    const result = await executeCctpTransferOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ data: [{ id: 'transfer-1' }] });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.circle.com/v1/w3s/transfers?sourceWalletId=wallet-123&pageSize=10',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getCctpTransfer';
      return 'transfer-123';
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeCctpTransferOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Configuration Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.circle.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getConfiguration', () => {
    it('should get API configuration successfully', async () => {
      const mockResponse = { data: { supportedChains: ['ETH', 'AVAX'] } };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getConfiguration');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.circle.com/v1/configuration',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle configuration fetch error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getConfiguration');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createSubscription', () => {
    it('should create webhook subscription successfully', async () => {
      const mockResponse = { data: { id: 'sub-123', endpoint: 'https://webhook.example.com' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSubscription')
        .mockReturnValueOnce('test-key-123')
        .mockReturnValueOnce('https://webhook.example.com')
        .mockReturnValueOnce({ subscriptionType: 'payments' });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.circle.com/v1/subscriptions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Request-Id': 'test-key-123',
        },
        body: {
          endpoint: 'https://webhook.example.com',
          subscriptions: ['payments'],
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle subscription creation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createSubscription');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Subscription Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Subscription Error');
    });
  });

  describe('listSubscriptions', () => {
    it('should list webhook subscriptions successfully', async () => {
      const mockResponse = { data: [{ id: 'sub-123', endpoint: 'https://webhook.example.com' }] };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listSubscriptions');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.circle.com/v1/subscriptions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateSubscription', () => {
    it('should update webhook subscription successfully', async () => {
      const mockResponse = { data: { id: 'sub-123', endpoint: 'https://new-webhook.example.com' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateSubscription')
        .mockReturnValueOnce('sub-123')
        .mockReturnValueOnce('https://new-webhook.example.com')
        .mockReturnValueOnce({ subscriptionType: 'transfers' });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.circle.com/v1/subscriptions/sub-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          endpoint: 'https://new-webhook.example.com',
          subscriptions: ['transfers'],
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteSubscription', () => {
    it('should delete webhook subscription successfully', async () => {
      const mockResponse = { message: 'Subscription deleted successfully' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteSubscription')
        .mockReturnValueOnce('sub-123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeConfigurationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.circle.com/v1/subscriptions/sub-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});
});
