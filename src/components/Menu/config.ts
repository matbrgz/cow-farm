import { MenuEntry } from '@pancakeswap-libs/uikit'
import tokens from 'config/constants/tokens'
import { BASE_BSC_SCAN_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.cowswap.finance/#/swap',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.cowswap.finance/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
    status: {
      color: "failure", text: "LIVE"
    }
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/pools',
  },
  // {
  //   label: 'Prediction',
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  //   status: {
  //     text: 'BETA',
  //     color: 'warning',
  //   },
  // },
  {
    label: 'Lottery',
    icon: 'TicketIcon',
    href: '/',
    status: {
      text: 'COMMING',
      color: 'warning',
    },
  },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  {
    label: 'NFT',
    icon: 'TeamBattleIcon',
    href: '/',
    status: {
      text: 'COMMING',
      color: 'warning',
    },
  },
  {
    label: 'Teams & Profile',
    icon: 'GroupsIcon',
    href: '/',
    // items: [
    //   {
    //     label: 'Leaderboard',
    //     href: '/teams',
    //   },
    //   {
    //     label: 'Task Center',
    //     href: '/profile/tasks',
    //   },
    //   {
    //     label: 'Your Profile',
    //     href: '/profile',
    //   },
    // ],
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    href: '/',
    // items: [
    //   {
    //     label: 'Overview',
    //     href: 'https://cowswap.info',
    //   },
    //   {
    //     label: 'Tokens',
    //     href: 'https://cowswap.info/tokens',
    //   },
    //   {
    //     label: 'Pairs',
    //     href: 'https://cowswap.info/pairs',
    //   },
    //   {
    //     label: 'Accounts',
    //     href: 'https://cowswap.info/accounts',
    //   },
    // ],
  },
  {
    label: 'IFO',
    icon: 'IfoIcon',
    href: '/',
    status: {
      text: 'COMMING',
      color: 'warning',
    },
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    href: '/',
    items: [
      // {
      //   label: 'Contact',
      //   href: 'https://docs.cowswap.finance/contact-us',
      // },
      // {
      //   label: 'Voting',
      //   href: 'https://voting.cowswap.finance',
      // },
      {
        label: 'Github',
        href: 'https://github.com/cowswap',
      },
      {
        label: 'Docs',
        href: 'https://docs.cowswap.finance',
      },
      {
        label: 'Gouda Contract',
        href: `${BASE_BSC_SCAN_URL}/address/${getAddress(tokens.cow.address)}`,
      },
    ],
  },
]

export default config
