import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Lottie from 'react-lottie';
import { Flex, Heading, Text, Button, AutoRenewIcon, Modal, useModal, PrizeIcon, Image, MetamaskIcon } from '@cowswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import { getLuckyDrawContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawAddress, getAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import luckyDrawAbi from 'config/abi/luckyDraw.json'
import { registerToken } from 'utils/wallet'
import luckyCow from './images/luckyCow-animation.json'
import feedMeSrc from './images/feed-me.png'
import fieldSrc from './images/field.png'

const goudaSrc = `${BASE_URL}/images/tokens/GOUDA.png`

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: luckyCow,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const PageStyled = styled(Page)`
  ${({ theme }) => theme.mediaQueries.xs} {
    background-image: url(${fieldSrc});
    background-size: cover;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    background-image: none;
  }
  background-image: none;
`

const StyledImage = styled.img`
  ${({ theme }) => theme.mediaQueries.xs} {
    display: none;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: -1;
  }
`

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

const AddresesStyled = styled.div`
  height: 300px;
  overflow: auto
`

const CardHeading = styled(Flex)`
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  svg {
    margin-right: 4px;
  }
  h2 {
    font-size: 27px !important
  }
`

const draws = [
  {
    label: 'Win 500 Gouda',
    type: 500
  },
  {
    label: 'Win 100 Gouda',
    type: 100
  },
  {
    label: 'Win 10 Gouda',
    type: 10
  },
]

const factoryColor = {
  '10': '#e67b57',
  '100': '#7c7c89',
  '500': '#FFB130',
}

const factorySlots = {
  '10': 1000,
  '100': 10,
  '500': 3,
}

const MAX_TIME = 3

interface WonAddressProps {
  address: string
  account: string
}

const WonAddress: React.FC<WonAddressProps> = ({address, account}) => {
  return <p key={address} style={{wordBreak: "break-all", color: address === account ? "#1FC7D4" : "#323063", marginBottom: 15 }}><a rel="noreferrer" target="_blank" href={`${BASE_BSC_SCAN_URL}/address/${address}`}>{address}</a></p>
}

const LuckyDrawActions = ({type, handleDraw, winners, spinLoading, account, won, spinTimes, handleClaim, isClaimed}) => {
  const isOutOfSlots = winners[type].length >= factorySlots[type]
  if (String(won) === String(type)) {
    return <Button
      variant="success"
      mt="20px"
      width="100%"
      disabled={isClaimed || spinLoading}
      onClick={handleClaim}
      endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {isClaimed ? 'Claimed' : 'Claim your prize'}
    </Button>
  }
  if (isOutOfSlots) {
    return <Button
      variant="success"
      mt="20px"
      width="100%"
      disabled
    >
      This Prize is out of slots
    </Button>
  }
  return account ? <Button
    variant="success"
    mt="20px"
    width="100%"
    isLoading={(MAX_TIME - spinTimes) && spinLoading}
    disabled={MAX_TIME - spinTimes < 1 || won === undefined || won}
    onClick={() => handleDraw(type)}
    endIcon={won === undefined || spinLoading || spinTimes === -1 ? <AutoRenewIcon spin color="currentColor" /> : null}
  >
    Spin {won === undefined || spinTimes === -1 ? '' : `(${MAX_TIME - spinTimes} grass)`}
  </Button> : <Button
    variant="success"
    mt="20px"
    width="100%"
    disabled
  >
    Wallet is not connected
  </Button>
}

const LuckyDraw: React.FC = () => {
  const web3 = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const [wonPrize, setWonPrize] = useState(undefined)
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const [spinLoading, setSpinLoading] = useState(false)
  const [isClaimed, setIsClaimed] = useState()
  const [userResult, setUserResult] = useState({
    '10': -1,
    '100': -1,
    '500': -1
  })
  const [winners, setWinners] = useState({
    '10': [],
    '100': [],
    '500': []
  })

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const luckyDrawAddress = getLuckyDrawAddress()

  const luckyDrawContract = useMemo(() => {
    return getLuckyDrawContract(luckyDrawAddress, web3)
  }, [luckyDrawAddress, web3])

  const handleClaim= useCallback(async () => {
    try {
      setSpinLoading(true)
      window.scrollTo(0, 200);
      await luckyDrawContract.methods
        .claim()
        .send({ from: account, gas: 200000, to: luckyDrawAddress })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
      setSpinLoading(false)
      return toastSuccess(
        'Lucky Draw',
        `Your GOUDA have been transferred to your wallet!`,
      )
    } catch (e) {
      toastError('Lucky Draw', 'Please try again !')
      return setSpinLoading(false)
    }
  }, [luckyDrawContract, account, luckyDrawAddress, setSpinLoading, toastSuccess, toastError])

  useEffect(() => {
    try {
      if (account) {
        luckyDrawContract.methods.getUser(account).call()
          .then(({_time500, _time100, _time10, _prize, _claim}) => {
            setUserResult({
              '10': _time10,
              '100': _time100,
              '500': _time500
            })

            setWonPrize(Number(_prize))
            setIsClaimed(_claim)
          })
      }
    } catch (error) {
      console.error(error)
    }
  }, [luckyDrawContract, account, currentBlock])

  useEffect(() => {
    try {
      if (account) {
        multicall(luckyDrawAbi, [
          {
            address: luckyDrawAddress,
            name: 'getWin',
            params: [500],
          },
          {
            address: luckyDrawAddress,
            name: 'getWin',
            params: [100],
          },
          {
            address: luckyDrawAddress,
            name: 'getWin',
            params: [10],
          },
        ]).then(([[type500], [type100], [type10]]) => {
          setWinners({
            '10': type10,
            '100': type100,
            '500': type500
          })
        })
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [currentBlock, luckyDrawContract, account, luckyDrawAddress])

  const handleDraw = useCallback(async (type) => {
    try {
      setSpinLoading(true)
      window.scrollTo(0, 200);
      await luckyDrawContract.methods
        .random(type)
        .send({ from: account, gas: 200000, to: luckyDrawAddress })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
      const res = await luckyDrawContract.methods.getUser(account).call()
      setSpinLoading(false)
      if (res._win) {
        return toastSuccess(
          'Lucky Draw',
          `Congratulations! You Won ${type} Gouda`,
        )
      }
      return toastError('Lucky Draw', 'Better luck next time!!!')
    } catch (e) {
      toastError('Lucky Draw', 'Please try again !')
      return setSpinLoading(false)
    }
  }, [luckyDrawContract, account, luckyDrawAddress, setSpinLoading, toastSuccess, toastError])

  const [onPresentWon10Modal] = useModal(<Modal title="Won 10 GOUDA">
    <AddresesStyled>{winners['10'].length ? winners['10'].map(address => <WonAddress key={address} address={address} account={account} />) : <Text style={{ width: "425px" }} color="#323063">No winners... yet!</Text>}</AddresesStyled>
  </Modal>)

  const [onPresentWon100Modal] = useModal(<Modal title="Won 100 GOUDA">
    <AddresesStyled>{winners['100'].length ? winners['100'].map(address => <WonAddress key={address} address={address} account={account} />) : <Text style={{ width: "425px" }} color="#323063">No winners... yet!</Text>}</AddresesStyled>
  </Modal>)

  const [onPresentWon500Modal] = useModal(<Modal title="Won 500 GOUDA">
    <AddresesStyled>{winners['500'].length ? winners['500'].map(address => <WonAddress key={address} address={address} account={account} />) : <Text style={{ width: "425px" }} color="#323063">No winners... yet!</Text>}</AddresesStyled>
  </Modal>)

  const factoryModal = {
    '10': onPresentWon10Modal,
    '100': onPresentWon100Modal,
    '500': onPresentWon500Modal,
  }

  return (
    <>
      <PageStyled>
        <Heading as="h1" textAlign="center" size="xl" mb="24px" color="text">
          Lucky draw
        </Heading>
        {spinLoading ? <Lottie options={defaultOptions}
          width={250}
        /> : <Image mx="auto"
          src={feedMeSrc}
          alt="lucky-draw"
          width={250}
          height={250}/>}
        {account && isMetaMaskInScope && (
          <Flex justifyContent="center" style={{
            cursor: 'pointer',
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
        <FlexLayout>
          {draws.map(({ label, type }) => {
            return <FCard key={type}>
              <CardHeading>
                <Flex justifyContent="center" alignItems="center">
                  <Heading color={factoryColor[type]} mb="20px">{label}</Heading>
                </Flex>
              </CardHeading>
              <LuckyDrawActions
                type={type}
                handleDraw={handleDraw}
                winners={winners}
                spinLoading={spinLoading}
                account={account}
                won={wonPrize}
                spinTimes={userResult[type]}
                handleClaim={handleClaim}
                isClaimed={isClaimed}
              />
              <Button mt="15px" variant="primary" onClick={factoryModal[type]} endIcon={<PrizeIcon width="25px" color="currentColor" />}>Winner list</Button>
            </FCard>
          })}
        </FlexLayout>
      </PageStyled>
      <StyledImage src={fieldSrc} />
    </>
  )
}

export default LuckyDraw
