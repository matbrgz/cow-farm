import React, { useState, useCallback, useMemo } from 'react'
import { Flex, Heading, Image, Text, Button } from '@cowswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getPresaleContract } from 'utils/contractHelpers'
import { getPresaleAddress } from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'
import PresaleInput from './components/PresaleInput'

import goudaIcon from './icons/GOUDA.svg'
import arrowIcon from './icons/arrow.svg'
import bnbIcon from './icons/BNB.svg'
import busdIcon from './icons/BUSD.svg'


const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const CardHeading = styled(Flex)`
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  svg {
    margin-right: 4px;
  }
  h2 {
    font-size: 32px !important
  }
`


const Presale: React.FC = () => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const [valBnb, setValBnb] = useState('')
  const { balance: bnbBalance } = useGetBnbBalance()

  const fullBnbBalance = useMemo(() => {
    return getFullDisplayBalance(bnbBalance)
  }, [bnbBalance])

  const handleSelectMaxBnb = useCallback(() => {
    setValBnb(fullBnbBalance)
  }, [fullBnbBalance, setValBnb])

  const handleBnbChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setValBnb(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setValBnb],
  )

  const handleBuyByBnb = useCallback(async() => {
    const presaleAddress = getPresaleAddress()
    const presaleContract = getPresaleContract(presaleAddress, web3)
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceHex = web3.utils.toHex(Math.round(Number(gasPrice)));
    console.log({ from: account, gas: 200000, to: presaleAddress, value: new BigNumber(valBnb).times(10**18).toString(), gasPrice: gasPriceHex })
    const res = await presaleContract.methods
    .buy(new BigNumber(valBnb).times(10**18).toString())
    .send({ from: account, gas: 200000, to: presaleAddress, value: new BigNumber(valBnb).times(10**18).toString(), gasPrice: gasPriceHex })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
    console.log(res)
  }, [valBnb, account, web3])

  return (
    <>
      <Page>
        <Heading as="h1" size="xl" mb="24px" color="text">
          Presale
        </Heading>
        <Text fontSize="20px" color="text">Total:</Text>
        <FlexLayout>
          <FCard>
            <CardHeading>
              <Heading color="text" mb="20px" >GOUDA - BNB</Heading>
              <Flex justifyContent="center" alignItems="center">
                <Image src={bnbIcon} alt="GOUDA - BNB" width={70} height={70} />
                <Image margin="0 23px" src={arrowIcon} alt="GOUDA - BNB" width={25} height={25} />
                <Image src={goudaIcon} alt="GOUDA - BNB" width={70} height={70} />
              </Flex>
            </CardHeading>
            <PresaleInput
              onSelectMax={handleSelectMaxBnb}
              onChange={handleBnbChange}
              value={valBnb}
              max={fullBnbBalance}
              symbol="BNB"
              inputTitle="buy"
            />
            <Button
              variant="primary"
              mt="20px"
              width="100%"
              disabled={valBnb === ''}
              onClick={handleBuyByBnb}
            >
              Buy presale
            </Button>
          </FCard>
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

export default Presale
