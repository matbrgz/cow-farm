import styled from 'styled-components'
import { Card } from '@cowswap/uikit'

const StyledCard = styled(Card)<{ isStaking?: boolean; isFinished?: boolean }>`
  max-width: 352px;
  margin: 0 8px 24px;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  display: flex;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'primary']};
  flex-direction: column;
  align-self: baseline;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export default StyledCard
