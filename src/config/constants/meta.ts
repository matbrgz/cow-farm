import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'CowSwap',
  description:
    'The most popular AMM on BSC by user count! Earn GOUDA through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by CowSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home | CowSwap',
  },
  '/competition': {
    title: 'Trading Battle | CowSwap',
  },
  '/prediction': {
    title: 'Prediction | CowSwap',
  },
  '/farms': {
    title: 'Farms | CowSwap',
  },
  '/pools': {
    title: 'Pools | CowSwap',
  },
  '/lottery': {
    title: 'Lottery | CowSwap',
  },
  '/collectibles': {
    title: 'Collectibles | CowSwap',
  },
  '/ifo': {
    title: 'Initial Farm Offering | CowSwap',
  },
  '/teams': {
    title: 'Leaderboard | CowSwap',
  },
  '/profile/tasks': {
    title: 'Task Center | CowSwap',
  },
  '/profile': {
    title: 'Your Profile | CowSwap',
  },
}
