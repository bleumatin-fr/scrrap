import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import { LinearProgress } from '@mui/material';
import {
  Indicator,
  Indicator2Values,
  Pie1D,
  Result,
  ScoreCard,
  Title,
} from '@scrrap/core';
import BaseBlock from '../ui/Block';

import Indicator2ValuesComponent from './Indicator2ValuesComponent';
import IndicatorComponent from './IndicatorComponent';
import Pie1DComponent from './Pie1DComponent';
import ScoreCardComponent from './ScoreCardComponent';

import Button from '../ui/Button';
import { ReactComponent as Co2Icon } from '../ui/icons/categories/co2.svg';
import { ReactComponent as SecondHand } from '../ui/icons/doccasion.svg';
import { ReactComponent as Cycle } from '../ui/icons/recycler.svg';
import { ReactComponent as TransportGoods } from '../ui/icons/categories/transport-good.svg';
import { ReactComponent as Waste } from '../ui/icons/categories/waste.svg';
import { ReactComponent as StakeHolders } from '../ui/icons/categories/stakeholders.svg';
import { ReactComponent as MachineUse } from '../ui/icons/categories/machine-use.svg';

const Block = styled(BaseBlock)`
  background-color: var(--results-bg);
  justify-content: flex-start;
  gap: 16px;

`;

interface ResultsSimpleProps {
  results?: Result[];
  loading: boolean;
}

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  margin: 0;
`;

const ResultsSimple = ({ results, loading }: ResultsSimpleProps) => {
  const navigate = useNavigate();
  return (
    <Block>
      <ResultsContainer>
        {(results || [])
          .filter((result) => result.scope === 'simple')
          .map((result, index) => {
            return (
              <ResultDispatch result={result} loading={loading} key={index} />
            );
          })}
      </ResultsContainer>
      <Button
        variant="contained"
        onClick={() => navigate(`./results`)}
        fullWidth
        color="primary"
        sx={{height:"56px", fontSize: "24px"}}
      >
        Résultats complets
      </Button>
    </Block>
  );
};

interface ResultDispatchProps {
  result: Result;
  loading: boolean;
}

const ResultSectionWithTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 16px;
  > div:first-of-type {
    flex: 1;
  }
  p {
    text-align: center;
  }
`;

//IT IS NEEDED TO DISPATCH ASAP AS TYPE OF RESULTS DOESN'T HAVE THE SAME PROPERTIES
const ResultDispatch = ({ result, loading }: ResultDispatchProps) => {
  switch (result.type) {
    case 'title':
      return (
        <ResultSection result={result} loading={loading} bgColor='black' noFullWidth>
          <p style={{color: "white"}}>{result.text}</p>
        </ResultSection>
      );
    case 'indicator':
      return (
        <ResultSection result={result} loading={loading}>
          <IndicatorComponent result={result} />
        </ResultSection>
      );
    case 'pie1D':
      return (
        <ResultSection result={result} loading={loading} height='150px'>
          <ResultSectionWithTitleContainer>
          <Pie1DComponent result={result} />
          <p className='hxb'>{result.title}</p>
          </ResultSectionWithTitleContainer>
        </ResultSection>
      );
    case 'indicator2Values':
      return (
        <ResultSection result={result} loading={loading}>
          <Indicator2ValuesComponent result={result} />
        </ResultSection>
      );
    case 'scoreCard':
      return (
        <ResultSection result={result} loading={loading}>
          <ScoreCardComponent result={result} />
        </ResultSection>
      );
  }
  return null;
};

interface ResultSectionContainerProps {
  height?: string;
  flex?: string;
  bgColor?: string;
  noFullWidth?: boolean;
}

const ResultSectionContainer = styled.div`
  background-color: ${(props: ResultSectionContainerProps) => props.bgColor ? props.bgColor : 'unset'};
  height: ${(props: ResultSectionContainerProps) => props.height};
  flex: ${(props: ResultSectionContainerProps) => props.flex};
  width: ${(props: ResultSectionContainerProps) => props.noFullWidth ? "unset": "100%"};
  position: relative;
  padding: 12px;
  overflow: hidden;
  @media screen and (max-height: 800px) {
    padding: 8px;
  }
  @media screen and (max-height: 600px) {
    padding: 6px;
  }
`;

interface ResultSectionProps {
  result: Indicator | ScoreCard | Indicator2Values | Pie1D | Title;
  children: JSX.Element | JSX.Element[];
  loading: boolean;
  height?: string;
  flex?: string;
  bgColor?: string;
  noFullWidth?: boolean;
}

export const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  flex-shrink: 1;
  @media screen and (max-height: 700px) {
    width: 30px;
    height: 30px;
  }
  @media screen and (max-height: 600px) {
    width: 20px;
    height: 20px;
  }
`;

export const scopeIcons: { [key: string]: ReactElement } = {
  co2: <Co2Icon />,
  'co2 évité': <Co2Icon />,
  'co2 total': <Co2Icon />,
  circularité: <SecondHand />,
  'réemploi total': <Cycle />,
  'approvisionnement': <TransportGoods />,
  'déchets évités total': <Waste />,
  'chutes réemployées total': <Cycle />,
  'partenariats': <StakeHolders />,
  'flux': <></>,
  'personnes sensibilisées': <></>,
  'consommation énergie machines':<MachineUse/>,
  'impact utilisation machines': <></>,
  'maintenance machines': <MachineUse/>,
};

const ResultSection = ({
  result,
  loading,
  children,
  height,
  flex,
  bgColor,
  noFullWidth
}: ResultSectionProps) => {
  return (
    <ResultSectionContainer key={result.code} height={height} flex={flex} bgColor={bgColor} noFullWidth={noFullWidth}>
      <LoadingIndicator loading={loading} />
      {children}
    </ResultSectionContainer>
  );
};

export const TitleScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 1;
  p {
    font-size: 14px;
  }
`;

const LoadingIndicatorContainer = styled.div`
  height: 4px;
  opacity: 0;
  transition: opacity 250ms;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  &.loading {
    opacity: 0.4;
  }
`;

const LoadingIndicator = ({ loading }: { loading: boolean }) => (
  <LoadingIndicatorContainer className={loading ? 'loading' : ''}>
    <LinearProgress />
  </LoadingIndicatorContainer>
);

export default ResultsSimple;
