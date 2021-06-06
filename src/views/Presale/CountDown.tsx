import React, {useState, useEffect, useMemo, useCallback} from 'react'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { Heading, Button } from '@cowswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getPresaleAddress } from 'utils/addressHelpers'
import { getPresaleContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import useToast from 'hooks/useToast'
import Presale from './Presale'

import moonSrc from './images/moon.svg'

const twoDigits = (num) => String(num).padStart(2, '0')

const targetBlock = process.env.REACT_APP_CHAIN_ID === '56' ? 8091190 : 9525751;

const CountDown: React.FC = () => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { currentBlock } = useBlock()
  const [isClaimed, setIsClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState((targetBlock - currentBlock) * 5)

  const presaleAddress = getPresaleAddress()
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    if (currentBlock) {
      setSecondsRemaining((targetBlock - currentBlock) * 5)
    }
  }, [currentBlock])

  const secondsToDisplay = secondsRemaining % 60
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
  const minutesToDisplay = minutesRemaining % 60
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60

  const presaleContract = useMemo(() => {
    return getPresaleContract(presaleAddress, web3)
  }, [presaleAddress, web3])

  useEffect(() => {
    try {
      if (account) {
        presaleContract.methods
          .claimers(account)
          .call()
          .then(setIsClaimed)
      }
    } catch(error) {
      console.error(error)
    }
  }, [presaleContract, account, currentBlock])

  const handleClaimAirdrop = useCallback(async() => {
    setClaiming(true)
    try {
      await presaleContract.methods
        .claim()
        .send({ from: account, gas: 200000, to: presaleAddress })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
      toastSuccess(
        'Airdrop',
        'Your GOUDA have been transferred to your wallet!',
      )
      setClaiming(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setClaiming(false)
    }
  }, [presaleContract, account, toastError, toastSuccess, presaleAddress])

  const claimAction = useMemo(() => {
    if (isClaimed) {
      return 'Claimed Airdrop'
    }
    if (claiming) {
      return 'Claiming ...'
    }
    return 'Claim Airdrop'
  }, [isClaimed, claiming])

  if (secondsRemaining < 1) {
    return <Presale />
  }

  return (
    <Page>
      <FlexLayout>
        <Heading as="h1" size="lg" mb="24px" color="secondary" textAlign="center">
          We&apos;re launching soon
        </Heading>
      </FlexLayout>
      <FlexLayout>
        {currentBlock ? <Heading as="h1" textAlign="center" size="xl" mb="24px" color="text">
          {twoDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
          {twoDigits(secondsToDisplay)}
        </Heading> : <Heading as="h1" textAlign="center" size="md" mb="24px" color="text">Fetching blocknumber ...</Heading>}
      </FlexLayout>
      <FlexLayout>
        <Button
          scale="md"
          variant="primary"
          disabled={isClaimed || claiming}
          onClick={handleClaimAirdrop}
        >
          {claimAction}
        </Button>
      </FlexLayout>
      <FlexLayout>
        <img style={{ width: '100%' }} alt="presale" src={moonSrc} />
      </FlexLayout>
    </Page>
  )
}

export default CountDown
