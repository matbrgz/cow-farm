import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { Heading, Button } from '@cowswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getPresaleAddress, getAddress } from 'utils/addressHelpers'
import { getPresaleContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import useToast from 'hooks/useToast'
import Presale from './Presale'

import moonSrc from './images/moon.svg'

const twoDigits = (num) => String(num).padStart(2, '0')

const startDate = new Date()
const endDate = new Date(Date.UTC(2021, 5, 7, 14, 0, 0));
const INITIAL_COUNT = Math.round((endDate.getTime() - startDate.getTime()) / 1000);

type IntervalFunction = () => ( unknown | void )

function useInterval( callback: IntervalFunction, delay: number | null ) {

  const savedCallback = useRef<IntervalFunction| null>( null )

  useEffect( () => {
    if (delay === null) return;
    savedCallback.current = callback
  } )

  useEffect(() => {
    if (delay === null) return undefined;
    function tick() {
      if ( savedCallback.current !== null ) {
        savedCallback.current()
      }
    }
    const id = setInterval(tick, delay)
    return () => clearInterval( id )
  }, [ delay ] )
}

const CountDown: React.FC = () => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { currentBlock } = useBlock()
  const [isClaimed, setIsClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT)
  const presaleAddress = getPresaleAddress()
  const { toastSuccess, toastError } = useToast()

  useInterval(
    () => {
      setSecondsRemaining(secondsRemaining - 1)
    },
    1000,
    // passing null stops the interval
  )

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
        <Heading as="h1" textAlign="center" size="xl" mb="24px" color="text">
          {twoDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
          {twoDigits(secondsToDisplay)}
        </Heading>
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
