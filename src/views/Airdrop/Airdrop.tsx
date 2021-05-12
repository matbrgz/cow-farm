import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@cowswap/uikit'
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Page from 'components/layout/Page'

const Hero = styled.div`
  align-items: start;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: left center, right center;
    padding-top: 0;
  }
`

const StyledText = styled(Text)`
  text-align: left;
  margin-top: 50px;
`

const CardImage = styled.img`
  margin-bottom: 20px;
  margin-top: 10px;
`
const CardImageAirdrop = styled.img`
  margin-bottom: 16px;
  margin: auto;
`
const ProgessStyled = styled.ul`
  position: relative;
  padding: 0 1rem 0 3.5rem;
  margin: 2rem 0 0;
  list-style: none;
  .progress__item {
    position: relative;
    counter-increment: list;
    padding-left: 0.5rem;
    height: 50px;
    line-height: 29px;
    .progress__title {
      color: #323063;
      text-align: left;
      span {
        color: #E67B57
      }
      a {
        color: #1DA1F2
      }
    }
    &:before {
      content: url('/images/arrow.svg');
      position: absolute;
      left: -2rem;
      top: 26px;
      height: 60%;
      width: 1px;
    }
    &:after {
      content: counter(list);
      position: absolute;
      top: 0;
      left: -2.5rem;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: transparent;
      color: #fff;
      font-weight: 400;
      font-size: 13px;
      line-height: 1.5rem;
      text-align: center;
      border: 1px solid #fff;
    }
    &:last-child {
      &:before {
        content: '';
      }
    }
    &.progress__item--active {
      &:after {
        background: #323063;
        color: #fff;
      }
    }
  }
`

const StyledTwitter = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  div {
    box-shadow: #2b7bb9 -4px 4px 4px;
    border-radius: 17px;
  }
`


const Airdrop: React.FC = () => {

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="text">
          Airdrop
        </Heading>
        <Text color="textSubtle">Requirements to earn free crypto coins</Text>
        <CardImage src="/images/tweeter.png" alt="gouda logo" />
        <StyledTwitter>
          <CardImageAirdrop src="/images/airdrop.png" alt="gouda logo" />
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="cowswap_finance"
            options={{height: 400}}
          />
        </StyledTwitter>
        <Text color="textSubtle">Native blockchain</Text>
        <CardImage src="/images/bsc.png" alt="gouda logo" />
        <Text color="textSubtle">Step-by-Step Guide CowSwap Airdrop</Text>
        <ProgessStyled>
          <li className="progress__item progress__item--active">
            <p className="progress__title">Retweet the <a href="https://twitter.com/Cowswap_finance/status/1392302756765986818?s=20">cowswap Giveaway</a> Tweet.</p>
          </li>
          <li className="progress__item progress__item--active">
            <p className="progress__title">Follow <a href="https://twitter.com/Cowswap_finance">@cowswap</a>  on Twitter.</p>
          </li>
          <li className="progress__item progress__item--active">
            <p className="progress__title">Get <span>$0,5</span> each of <span>$Gouda tokens.</span> Good Luck!</p>
          </li>
        </ProgessStyled>
        <StyledText color="textSubtle">If you like the CowSwap Airdrop, do not forget to Like/Comment below</StyledText>
        <StyledText color="textSubtle">Disclaimer: Investors should take the time to research any given product before they invest their funds.</StyledText>
      </Hero>
    </Page>
  )
}

export default Airdrop
