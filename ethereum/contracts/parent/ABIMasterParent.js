module.exports = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'defaultToken',
				type: 'address'
			},
			{
				internalType: 'string',
				name: 'tokenName',
				type: 'string'
			}
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'newCEO',
				type: 'address'
			}
		],
		name: 'CEOSet',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_walletAddress',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_landID',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: '_number',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_machineID',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: '_amountWin',
				type: 'uint256'
			}
		],
		name: 'GameResult',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_balance',
				type: 'uint256'
			}
		],
		name: 'NewBalance',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [],
		name: 'Paused',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [],
		name: 'Unpaused',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'newWorker',
				type: 'address'
			}
		],
		name: 'WorkerSet',
		type: 'event'
	},
	{
		payable: true,
		stateMutability: 'payable',
		type: 'fallback'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_tokenAmount',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'addFunds',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: '_newGameAddress',
				type: 'address'
			},
			{
				internalType: 'string',
				name: '_newGameName',
				type: 'string'
			},
			{
				internalType: 'uint256',
				name: '_maximumBet',
				type: 'uint256'
			}
		],
		name: 'addGame',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddress',
				type: 'address'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'addToken',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'ceoAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'checkAllocatedTokensPerGame',
		outputs: [
			{
				internalType: 'uint256',
				name: 'tokensInGame',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '_userAddress',
				type: 'address'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'checkApproval',
		outputs: [
			{
				internalType: 'uint256',
				name: 'approved',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'defaultTokenName',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'games',
		outputs: [
			{
				internalType: 'address',
				name: 'gameAddress',
				type: 'address'
			},
			{
				internalType: 'string',
				name: 'gameName',
				type: 'string'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddress',
				type: 'address'
			}
		],
		name: 'getBalanceByTokenAddress',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'getBalanceByTokenName',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'getMaximumBet',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_tokenAmount',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'manualAdjustment',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_tokenAmount',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'manualAllocation',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'maximumNumberBets',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'number',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [],
		name: 'pause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'paused',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'address',
				name: '_userAddress',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '_landID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_machineID',
				type: 'uint256'
			},
			{
				internalType: 'uint256[]',
				name: '_betIDs',
				type: 'uint256[]'
			},
			{
				internalType: 'uint256[]',
				name: '_betValues',
				type: 'uint256[]'
			},
			{
				internalType: 'uint256[]',
				name: '_betAmount',
				type: 'uint256[]'
			},
			{
				internalType: 'bytes32',
				name: '_localhash',
				type: 'bytes32'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'play',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			}
		],
		name: 'removeGame',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: '_newCEO',
				type: 'address'
			}
		],
		name: 'setCEO',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'bytes32',
				name: '_tail',
				type: 'bytes32'
			}
		],
		name: 'setTail',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: '_newWorker',
				type: 'address'
			}
		],
		name: 'setWorker',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'tail',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'bytes32',
				name: '_localhash',
				type: 'bytes32'
			}
		],
		name: 'testing',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string'
			}
		],
		name: 'tokens',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [],
		name: 'unpause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'address',
				name: '_newGame',
				type: 'address'
			},
			{
				internalType: 'string',
				name: '_newGameName',
				type: 'string'
			}
		],
		name: 'updateGame',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_maximumBet',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'updateMaximumBet',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: '_newTokenAddress',
				type: 'address'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'updateToken',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'winAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: '_gameID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256'
			},
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'withdrawCollateral',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'string',
				name: '_tokenName',
				type: 'string'
			}
		],
		name: 'withdrawMaxTokenBalance',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'workerAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	}
];
