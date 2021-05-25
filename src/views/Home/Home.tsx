import React from 'react'
import styled from 'styled-components'
import { Heading, Text, LinkExternal, Flex } from '@cowswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import { TwitterTimelineEmbed } from 'react-twitter-embed';
// import FarmStakingCard from 'views/Home/components/FarmStakingCard'
// import LotteryCard from 'views/Home/components/LotteryCard'
// import CakeStats from 'views/Home/components/CakeStats'
// import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
// import EarnAPRCard from 'views/Home/components/EarnAPRCard'
// import EarnAssetCard from 'views/Home/components/EarnAssetCard'
// import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  align-items: center;
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
    height: auto;
    padding-top: 0;
  }
`

// const Cards = styled(BaseLayout)`
//   align-items: stretch;
//   justify-content: stretch;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//     width: 100%;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 6;
//     }
//   }
// `

// const CTACards = styled(BaseLayout)`
//   align-items: start;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 4;
//     }
//   }
// `

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

const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          {t('Coming Soon')}
        </Heading>
        <Text mb="24px">{t('We will be celebrating the launch of our new site very soon')}</Text>
        <TwitterTimelineEmbed
            sourceType="profile"
            screenName="cowswap_finance"
            noFooter
            noHeader
            placeholder="Loading..."
            options={{height: 400, width: 500}}
          />
      </Hero>
      {/* <div>
        <Cards>
          <FarmStakingCard />
          <LotteryCard />
        </Cards>
        <CTACards>
          <EarnAPRCard />
          <EarnAssetCard />
          <WinCard />
        </CTACards>
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards>
      </div> */}
      <BottomStyled>
        <LinkExternal mr='50px' color="text" href='/airdrop'>View Airdrop details</LinkExternal>
        <LinkExternal color="text" href='/presale'>Presale</LinkExternal>
      </BottomStyled>
    </Page>
  )
}

export default Home
