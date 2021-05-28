import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'GOUDA',
    lpAddresses: {
      97: '0x14B06bF2C5B0AFd259c47c4be39cB9368ef0be3f',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'GOUDA-BNB LP',
    lpAddresses: {
      97: '0x93691d5B76112e461D4f407752cD20B147FA59AE',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.cow,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'GOUDA-BUSD LP',
    lpAddresses: {
      97: '0x5d5982350A67016d84B8e62CECE31F949730609a',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.cow,
    quoteToken: tokens.busd,
  },
]

export default farms
