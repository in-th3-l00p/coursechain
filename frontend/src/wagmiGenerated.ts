import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CoursesMarketplace
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const coursesMarketplaceAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_initialPrice', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AdminAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AdminRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'courseAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'title', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CoursePurchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'FallbackCalled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PriceUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Received',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address' }],
    name: 'addAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAdmins',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllCourses',
    outputs: [
      { name: '', internalType: 'contract Course[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'end', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCourses',
    outputs: [
      { name: '', internalType: 'contract Course[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getUserCourses',
    outputs: [
      { name: '', internalType: 'contract Course[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'price',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_title', internalType: 'string', type: 'string' },
      { name: '_slug', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_category', internalType: 'string', type: 'string' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'purchaseCourse',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'removeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newPrice', internalType: 'uint256', type: 'uint256' }],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

export const coursesMarketplaceAddress =
  '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const

export const coursesMarketplaceConfig = {
  address: coursesMarketplaceAddress,
  abi: coursesMarketplaceAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__
 */
export const useReadCoursesMarketplace = /*#__PURE__*/ createUseReadContract({
  abi: coursesMarketplaceAbi,
  address: coursesMarketplaceAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"getAdmins"`
 */
export const useReadCoursesMarketplaceGetAdmins =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'getAdmins',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"getAllCourses"`
 */
export const useReadCoursesMarketplaceGetAllCourses =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'getAllCourses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"getCourses"`
 */
export const useReadCoursesMarketplaceGetCourses =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'getCourses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"getUserCourses"`
 */
export const useReadCoursesMarketplaceGetUserCourses =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'getUserCourses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"isAdmin"`
 */
export const useReadCoursesMarketplaceIsAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'isAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"owner"`
 */
export const useReadCoursesMarketplaceOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"price"`
 */
export const useReadCoursesMarketplacePrice =
  /*#__PURE__*/ createUseReadContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'price',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__
 */
export const useWriteCoursesMarketplace = /*#__PURE__*/ createUseWriteContract({
  abi: coursesMarketplaceAbi,
  address: coursesMarketplaceAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"addAdmin"`
 */
export const useWriteCoursesMarketplaceAddAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'addAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"purchaseCourse"`
 */
export const useWriteCoursesMarketplacePurchaseCourse =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'purchaseCourse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"removeAdmin"`
 */
export const useWriteCoursesMarketplaceRemoveAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'removeAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteCoursesMarketplaceRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"setPrice"`
 */
export const useWriteCoursesMarketplaceSetPrice =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'setPrice',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteCoursesMarketplaceTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"withdrawFunds"`
 */
export const useWriteCoursesMarketplaceWithdrawFunds =
  /*#__PURE__*/ createUseWriteContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'withdrawFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__
 */
export const useSimulateCoursesMarketplace =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"addAdmin"`
 */
export const useSimulateCoursesMarketplaceAddAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'addAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"purchaseCourse"`
 */
export const useSimulateCoursesMarketplacePurchaseCourse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'purchaseCourse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"removeAdmin"`
 */
export const useSimulateCoursesMarketplaceRemoveAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'removeAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateCoursesMarketplaceRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"setPrice"`
 */
export const useSimulateCoursesMarketplaceSetPrice =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'setPrice',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateCoursesMarketplaceTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `functionName` set to `"withdrawFunds"`
 */
export const useSimulateCoursesMarketplaceWithdrawFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    functionName: 'withdrawFunds',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__
 */
export const useWatchCoursesMarketplaceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"AdminAdded"`
 */
export const useWatchCoursesMarketplaceAdminAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'AdminAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"AdminRemoved"`
 */
export const useWatchCoursesMarketplaceAdminRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'AdminRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"CoursePurchased"`
 */
export const useWatchCoursesMarketplaceCoursePurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'CoursePurchased',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"FallbackCalled"`
 */
export const useWatchCoursesMarketplaceFallbackCalledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'FallbackCalled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchCoursesMarketplaceOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"PriceUpdated"`
 */
export const useWatchCoursesMarketplacePriceUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'PriceUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link coursesMarketplaceAbi}__ and `eventName` set to `"Received"`
 */
export const useWatchCoursesMarketplaceReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: coursesMarketplaceAbi,
    address: coursesMarketplaceAddress,
    eventName: 'Received',
  })
