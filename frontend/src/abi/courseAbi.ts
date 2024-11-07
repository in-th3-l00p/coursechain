const courseAbi = [
  // Events
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "oldTitle",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newTitle",
        type: "string",
      },
    ],
    name: "TitleUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },

  // Functions
  {
    inputs: [],
    name: "getTitle",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_newTitle",
        type: "string",
      },
    ],
    name: "setTitle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Special Functions
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
];

export default courseAbi;
