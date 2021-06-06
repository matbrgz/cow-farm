import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Flex, Heading, Image, Text, Button, MetamaskIcon, LinkExternal } from '@cowswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getPresaleContract, getBep20Contract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { getPresaleAddress, getAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import tokens from 'config/constants/tokens'
import { DEFAULT_TOKEN_DECIMAL, BASE_URL, BASE_BSC_SCAN_URL } from 'config'
import presaleAbi from 'config/abi/presale.json'
import { registerToken } from 'utils/wallet'
import PresaleInput from './components/PresaleInput'

import goudaIcon from './icons/GOUDA.svg'
import arrowIcon from './icons/arrow.svg'
import bnbIcon from './icons/BNB.svg'
import busdIcon from './icons/BUSD.svg'
import presaleBackground from './images/presale.svg'

const goudaSrc = `${BASE_URL}/images/tokens/GOUDA.png`

const secondsToTime = (input: number | undefined) => {
  if(!input) {
    return 'N/A'
  }

  let seconds = input

  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  const mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;
  return `${days} days, ${hrs}:${mnts}:${seconds}`;
}

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
  margin-top: 25px;
`

const CardHeading = styled(Flex)`
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  svg {
    margin-right: 4px;
  }
  h2 {
    font-size: 31px !important
  }
`

const BottomStyled = styled(Flex)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: rgb(239, 244, 245);
  padding: 16px;
`

const Presale: React.FC = () => {
  const web3 = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const [valBnb, setValBnb] = useState('')
  const [valBusd, setValBusd] = useState('')
  const [estimatedBnbToGouda, setEstimatedBnbToGouda] = useState('0,00')
  const [estimatedBusdToGouda, setEstimatedBusdToGouda] = useState('0,00')
  const [countdown, setCountdown] = useState('00:00:00')
  const [yourGouda, setYourGouda] = useState('0,00')
  const [isClaimed, setIsClaimed] = useState(false)
  const [presaleToken, setPresaleToken] = useState('0')
  const [remainingToken, setRemainingToken] = useState('0')
  const [bnbPending, setBnbPending] = useState(false)
  const [busdPending, setBusdPending] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const { balance: bnbBalance } = useGetBnbBalance()
  const busdBalance = useTokenBalance(getAddress(tokens.busd.address))

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const presaleAddress = getPresaleAddress()

  const presaleContract = useMemo(() => {
    return getPresaleContract(presaleAddress, web3)
  }, [presaleAddress, web3])

  const busdContract = useMemo(() => {
    return getBep20Contract(getAddress(tokens.busd.address), web3)
  }, [web3])

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)

      if (account && presaleContract) {
        await busdContract.methods
          .approve(presaleContract.options.address, ethers.constants.MaxUint256)
          .send({ from: account })
      }
      setRequestedApproval(false)

      busdContract.methods.allowance(account, presaleAddress).call()
      .then(res => setAllowance(new BigNumber(res)))
    } catch (e) {
      console.error(e)
    }
  }, [busdContract, account, presaleContract, presaleAddress])

  useEffect(() => {
    try {
      if (account) {
        busdContract.methods.allowance(account, presaleAddress).call()
          .then(res => setAllowance(new BigNumber(res)))
      }
    } catch (error) {
      console.error(error)
    }
  }, [busdContract, presaleAddress, account])

  const fullBusdBalance = useMemo(() => {
    return getFullDisplayBalance(busdBalance)
  }, [busdBalance])

  const fullBnbBalance = useMemo(() => {
    return getFullDisplayBalance(bnbBalance)
  }, [bnbBalance])

  useEffect(() => {
    try {
      const value = new BigNumber(valBnb === '' ? '0' : valBnb).times(DEFAULT_TOKEN_DECIMAL).toString()

      presaleContract.methods.BNB2GOUDA(value)
        .call()
        .then(gouda => {
          setEstimatedBnbToGouda(new BigNumber(gouda).div(DEFAULT_TOKEN_DECIMAL).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }))
        })
    } catch (error) {
      console.error(error)
    }
  }, [valBnb, presaleContract])

  useEffect(() => {
    try {
      const value = new BigNumber(valBusd === '' ? 0 : Number(valBusd)).times(DEFAULT_TOKEN_DECIMAL).toString()
      presaleContract.methods.BUSD2Gouda(value)
        .call()
        .then(gouda => {
          setEstimatedBusdToGouda(new BigNumber(gouda).div(DEFAULT_TOKEN_DECIMAL).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }))
        })
    } catch (error) {
      console.error(error)
    }
  }, [valBusd, presaleContract])

  useEffect(() => {
    try {
      if (account) {
        multicall(presaleAbi, [
          {
            address: presaleAddress,
            name: 'getRemainingToken',
            params: [],
          },
          {
            address: presaleAddress,
            name: 'presaleLocking',
            params: [],
          },
          {
            address: presaleAddress,
            name: 'remainAirdrop',
            params: [],
          },
          {
            address: presaleAddress,
            name: 'buyers',
            params: [account],
          },
          {
            address: presaleAddress,
            name: 'unlockPresaleBlock',
            params: [],
          }
        ]).then(([presaleTotal, presaleLocked, remainAirdrop, boughtGouda, blockToUnblock]) => {
          const tokenLeft = new BigNumber(presaleTotal)
            .minus(new BigNumber(presaleLocked)).minus(new BigNumber(remainAirdrop)).div(DEFAULT_TOKEN_DECIMAL)
  
          setPresaleToken(new BigNumber(presaleTotal).minus(new BigNumber(remainAirdrop)).div(DEFAULT_TOKEN_DECIMAL).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }))
          setRemainingToken(tokenLeft.toNumber().toLocaleString('en-US', { maximumFractionDigits: 0 }))
          setYourGouda(new BigNumber(boughtGouda).div(DEFAULT_TOKEN_DECIMAL).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }))
          setCountdown(secondsToTime(new BigNumber(blockToUnblock).minus(currentBlock).toNumber() * 5))
        })
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [currentBlock, presaleContract, account, presaleAddress])

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

  const handleSelectMaxBusd = useCallback(() => {
    setValBusd(fullBusdBalance)
  }, [fullBusdBalance, setValBusd])

  const handleBusdChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setValBusd(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setValBusd],
  )

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

  const handleBuyByBusd = useCallback(async() => {
    setBusdPending(true)
    try {
      const value = new BigNumber(valBusd).times(DEFAULT_TOKEN_DECIMAL).toString()

      await presaleContract.methods
        .buyByBUSD(value)
        .send({ from: account, gas: 200000 })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
      toastSuccess(
        'Buy Presale',
        'Your GOUDA have been transferred to your wallet!',
      )
      setValBusd('')
      setBusdPending(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setBusdPending(false)
    }
    
  }, [valBusd, account, presaleContract, toastError, toastSuccess])

  const handleBuyByBnb = useCallback(async () => {
    setBnbPending(true)
    try {
      await presaleContract.methods
        .buy()
        .send({ from: account, gas: 200000, to: presaleAddress, value: new BigNumber(valBnb).times(DEFAULT_TOKEN_DECIMAL).toString() })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
      toastSuccess(
        'Buy Presale',
        'Your GOUDA have been transferred to your wallet!',
      )
      setValBnb('')
      setBnbPending(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setBnbPending(false)
    }
    
  }, [valBnb, account, presaleContract, presaleAddress, toastError, toastSuccess])

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

  return (
    <>
      <Page>
        <FlexLayout>
          <div>
            <Heading as="h1" textAlign="left" size="xl" mb="24px" color="text">
              Presale
            </Heading>
            <LinkExternal style={{ color: '#E67B56' }} href={`${BASE_BSC_SCAN_URL}/address/${getAddress(tokens.cow.address)}`}>
              Gouda address
            </LinkExternal>
            <p style={{ fontSize: 20, color: '#323063', marginTop: 15, textAlign: "left" }}>
              Total: <span style={{ fontSize: 30 }}>{presaleToken}</span> Gouda
            </p>
            <p style={{ fontSize: 20, color: '#323063', marginTop: 15, textAlign: "left" }}>
              Remaining: <span style={{ fontSize: 30 }}>{remainingToken}</span> Gouda
            </p>
            <p style={{ fontSize: 20, color: '#E67B56', marginTop: 25, textAlign: "left", borderTop: "1px solid #E67B56", paddingTop: 15 }}>
              Your locked: <span style={{ fontSize: 30 }}>{yourGouda}</span> Gouda
            </p>
            <div style={{ background: '#EBEBEB', borderRadius: 12, padding: 8, marginTop: 15, width: '75%' }}>
              <p style={{ fontSize: 13, color: '#1DA1F2', textAlign: "center" }}>
                Unlock time remaining:
              </p>
              <p style={{ fontSize: 13, color: '#1DA1F2', textAlign: "center", marginTop: 6 }}>
                {countdown}
              </p>
            </div>
            {account && isMetaMaskInScope && (
              <Flex justifyContent="flex-start" style={{
                cursor: 'pointer',
                marginTop: 15
              }} onClick={() => registerToken(getAddress(tokens.cow.address), 'GOUDA', 18, goudaSrc)}>
                <Text
                  color="textSubtle"
                  small
                >
                  Add GOUDA to Metamask
                </Text>
                <MetamaskIcon ml="4px" />
              </Flex>
            )}
          </div>
          <div>
            <Image
              mx="auto"
              mt="12px"
              src={presaleBackground}
              alt="Pancake illustration"
              width={300}
              height={230}
            />
          </div>
        </FlexLayout>
        <FlexLayout>
          <FCard>
            <CardHeading>
              <Heading fontSize="25px" color="text" mb="20px">BNB - GOUDA</Heading>
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
            <Text textAlign="left" color="textSubtle" mr={20} >~{estimatedBnbToGouda} Gouda</Text>
            <Button
              variant="primary"
              mt="20px"
              width="100%"
              disabled={valBnb === '' || bnbPending}
              onClick={handleBuyByBnb}
            >
              {bnbPending ? 'Buying...' : 'Buy presale'}
            </Button>
          </FCard>
          <FCard>
            <CardHeading>
              <Heading fontSize="25px" color="text" mb="20px" >BUSD - GOUDA</Heading>
              <Flex justifyContent="center" alignItems="center">
                <Image src={busdIcon} alt="GOUDA - BUSD" width={70} height={70} />
                <Image margin="0 23px" src={arrowIcon} alt="GOUDA - BUSD" width={25} height={25} />
                <Image src={goudaIcon} alt="GOUDA - BUSD" width={70} height={70} />
              </Flex>
            </CardHeading>
            <PresaleInput
              onSelectMax={handleSelectMaxBusd}
              onChange={handleBusdChange}
              value={valBusd}
              max={fullBusdBalance}
              symbol="BUSD"
              inputTitle="buy"
            />
            <Text textAlign="left" color="textSubtle" mr={20} >~{estimatedBusdToGouda} Gouda</Text>
            {isApproved ? (<Button
              variant="primary"
              mt="20px"
              width="100%"
              disabled={valBusd === '' || busdPending}
              onClick={handleBuyByBusd}
            >
              {busdPending ? 'Buying...' : 'Buy presale'}
            </Button>) : (<Button
              variant="primary"
              mt="20px"
              width="100%"
              disabled={requestedApproval}
              onClick={handleApprove}
            >
              Approve Contract
            </Button>)}
          </FCard>
        </FlexLayout>
      </Page>
      <BottomStyled>
        <Text color="textSubtle" mr={20} >News: </Text>
        <Button
          scale="sm"
          variant="primary"
          disabled={isClaimed || claiming}
          onClick={handleClaimAirdrop}
        >
          {claimAction}
        </Button>
      </BottomStyled>
    </>
  )
}

export default Presale
