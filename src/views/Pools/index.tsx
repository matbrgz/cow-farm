import React, { useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Image } from '@cowswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { usePools, useBlock } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PoolCard from './components/PoolCard'

const Pools: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const { currentBlock } = useBlock()
  const [, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || currentBlock > pool.endBlock),
    [currentBlock, pools],
  )

  // This pool is passed explicitly to the cake vault
  // const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])

  return (
    <>
      <Page>
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {/* <CakeVaultCard pool={cakePoolData} account={account} /> */}
              {orderBy(openPools, ['sortOrder']).map((pool) => (
                <PoolCard key={pool.sousId} pool={pool} account={account} />
              ))}
            </>
          </Route>
        </FlexLayout>
        <Image
          mx="auto"
          mt="12px"
          src="/images/pool-syrup-cow.svg"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        />
      </Page>
    </>
  )
}

export default Pools
