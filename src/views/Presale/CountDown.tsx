import React, {useState, useEffect, useRef} from 'react'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { Heading } from '@cowswap/uikit'
import Presale from './Presale'

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

  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT)

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
    </Page>
  )
}

export default CountDown
