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
    label: 'Lucky draw',
    icon: 'LuckyDrawIcon',
    href: '/luckydraw',
  },
  // {
  //   label: 'Airdrop',
  //   icon: 'AirdropIcon',
  //   href: '/airdrop',
  // },
  {
    label: 'Presale',
    icon: 'PresaleIcon',
    href: '/presale',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: '/',
        // href: 'https://exchange.cowswap.app/#/swap',
      },
      {
        label: 'Liquidity',
        href: '/',
        // href: 'https://exchange.cowswap.app/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/',
    // href: '/farms',
    status: {
      text: 'COMING',
      color: 'warning',
    },
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/',
    // href: '/pools',
    status: {
      text: 'COMING',
      color: 'warning',
    },
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
      text: 'COMING',
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
    icon: 'NftIcon',
    href: '/',
    status: {
      text: 'COMING',
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
      text: 'COMING',
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
      //   href: 'https://docs.cowswap.app/contact-us',
      // },
      // {
      //   label: 'Voting',
      //   href: 'https://voting.cowswap.app',
      // },
      {
        label: 'Github',
        href: 'https://github.com/cowswap',
      },
      {
        label: 'Docs',
        href: 'https://docs.cowswap.app',
      },
      {
        label: 'Gouda Contract',
        href: `${BASE_BSC_SCAN_URL}/address/${getAddress(tokens.cow.address)}`,
      },
    ],
  },
]

export default config
