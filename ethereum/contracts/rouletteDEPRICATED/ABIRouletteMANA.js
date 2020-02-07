module.exports = [
  {
    inputs: [
      {
        internalType: 'contract RouletteLogicInternal',
        name: '_rlt',
        type: 'address'
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
    inputs: [
      {
        indexed: false,
        internalType: 'contract RouletteLogicInternal',
        name: 'rlt',
        type: 'address'
      }
    ],
    name: 'RLTChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_walletAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes5',
        name: '_tokenSymbol',
        type: 'bytes5'
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
        indexed: true,
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
    name: 'SpinResult',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Unpaused',
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
        name: '_amountMANA',
        type: 'uint256'
      }
    ],
    name: 'addFunds',
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
    constant: false,
    inputs: [
      {
        internalType: 'contract RouletteLogicInternal',
        name: '_rlt',
        type: 'address'
      }
    ],
    name: 'changeRLT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address'
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
    name: 'checkFunds',
    outputs: [
      {
        internalType: 'uint256',
        name: 'fundsInContract',
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
    name: 'funds',
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
    name: 'maximumBetsAmount',
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
    name: 'minimumBet',
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
        internalType: 'uint256',
        name: '_localhash',
        type: 'uint256'
      }
    ],
    name: 'play',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'rlt',
    outputs: [
      {
        internalType: 'contract RouletteLogicInternal',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_minimumBet',
        type: 'uint256'
      }
    ],
    name: 'setAmounts',
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
    inputs: [],
    name: 'unpause',
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
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawFunds',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
