import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Flex, Heading, Text, Button, AutoRenewIcon, Modal, useModal, PrizeIcon } from '@cowswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import { getLuckyDrawContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import luckyDrawAbi from 'config/abi/luckyDraw.json'

// const goudaSrc = `${BASE_URL}/images/tokens/GOUDA.png`

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

const MAX_TIME = 3

const LuckyDraw: React.FC = () => {
  const web3 = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const [won, setWon] = useState(undefined)
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const [spinLoading, setSpinLoading] = useState(false)
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

  const luckyDrawAddress = getLuckyDrawAddress()

  const luckyDrawContract = useMemo(() => {
    return getLuckyDrawContract(luckyDrawAddress, web3)
  }, [luckyDrawAddress, web3])

  useEffect(() => {
    try {
      if (account) {
        luckyDrawContract.methods.getUser(account).call()
          .then(({_time500, _time100, _time10, _win}) => {
            setUserResult({
              '10': _time10,
              '100': _time100,
              '500': _time500
            })
            setWon(_win)
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
    {winners['10'].length ? winners['10'].map(address => <p style={{wordBreak: "break-all", color: "#323063", marginBottom: 15 }}>{address}</p>) : <Text color="#323063">No winners... yet!</Text>}
  </Modal>)

  const [onPresentWon100Modal] = useModal(<Modal title="Won 100 GOUDA">
    {winners['100'].length ? winners['100'].map(address => <p style={{wordBreak: "break-all", color: "#323063", marginBottom: 15 }}>{address}</p>) : <Text color="#323063">No winners... yet!</Text>}
  </Modal>)

  const [onPresentWon500Modal] = useModal(<Modal title="Won 500 GOUDA">
    {winners['500'].length ? winners['500'].map(address => <p style={{wordBreak: "break-all", color: "#323063", marginBottom: 15 }}>{address}</p>) : <Text color="#323063">No winners... yet!</Text>}
  </Modal>)

  const factoryModal = {
    '10': onPresentWon10Modal,
    '100': onPresentWon100Modal,
    '500': onPresentWon500Modal,
  }

  return (
    <Page>
      <FlexLayout>
        <Heading as="h1" textAlign="left" size="xl" mb="24px" color="text">
          Lucky draw
        </Heading>
      </FlexLayout>
      <FlexLayout>
        {draws.map(({ label, type }) => {
          return <FCard key={type}>
            <CardHeading>
              <Flex justifyContent="center" alignItems="center">
                <Heading fontSize="25px" color="#323063" mb="20px">{label}</Heading>
                {/* <Image src={goudaIcon} alt="GOUDA - BNB" width={50} height={50} /> */}
              </Flex>
            </CardHeading>
            <Button
              variant="subtle"
              mt="20px"
              width="100%"
              isLoading={spinLoading}
              disabled={MAX_TIME - userResult[type] < 1 || won === undefined || won}
              onClick={() => handleDraw(type)}
              endIcon={won === undefined || spinLoading || userResult[type] === -1 ? <AutoRenewIcon spin color="currentColor" /> : null}
            >
              Spin {won === undefined || userResult[type] === -1 ? '' : `(${MAX_TIME - userResult[type]})`}
            </Button>
            <Button mt="15px" variant="primary" onClick={factoryModal[type]} endIcon={<PrizeIcon width="25px" color="currentColor" />}>View details</Button>
          </FCard>
        })}
      </FlexLayout>
    </Page>
  )
}

export default LuckyDraw
