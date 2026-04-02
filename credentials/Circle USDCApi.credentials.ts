import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CircleUSDCApi implements ICredentialType {
	name = 'circleUSDCApi';
	displayName = 'Circle USDC API';
	documentationUrl = 'https://developers.circle.com/docs/getting-started';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Circle API key obtained from Circle Console',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'sandbox',
			required: true,
			description: 'Circle API environment',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.circle.com',
			required: true,
			description: 'Circle API base URL',
		},
	];
}