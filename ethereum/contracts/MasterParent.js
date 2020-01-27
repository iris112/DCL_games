module.exports = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_betID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "createBet",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_betID",
				"type": "uint256"
			}
		],
		"name": "getPayoutForType",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_localhash",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_machineID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_landID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_tokenName",
				"type": "string"
			}
		],
		"name": "launch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "winAmount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
