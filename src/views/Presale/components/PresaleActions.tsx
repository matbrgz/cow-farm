import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { provider as ProviderType } from 'web3-core'
import BigNumber from 'bignumber.js'
import { useLocation } from 'react-router-dom'
import { getAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'
import { Button, Flex, Text } from '@cowswap/uikit'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useWeb3 from 'hooks/useWeb3'
import { useApprove } from 'hooks/useApprove'
import UnlockButton from 'components/UnlockButton'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  provider?: ProviderType
  account?: string
  onPresentDeposit?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, onPresentDeposit }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const earnings = new BigNumber(earningsAsString)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const web3 = useWeb3()

  // const { onApprove } = useApprove(lpContract)

  // const handleApprove = useCallback(async () => {
  //   try {
  //     setRequestedApproval(true)
  //     await onApprove()
  //     setRequestedApproval(false)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <Button onClick={() => {}} disabled={location.pathname.includes('archived')}>
        {t('Stake LP')}
      </Button>
    ) : (
      <Button
        variant="primary"
        mt="8px"
        width="100%"
        disabled={requestedApproval || location.pathname.includes('archived')}
        // onClick={handleApprove}
      >
        {t('Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <Flex>
        <Text textTransform="uppercase" color="text" fontSize="12px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          GOUDA
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      <Flex>
        <Text textTransform="uppercase" color="text" fontSize="12px" pr="3px">
          {/* {lpName} */}
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
