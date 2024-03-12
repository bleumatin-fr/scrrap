import styled from '@emotion/styled';
import { Indicator2Values } from '@scrrap/core';

import { TitleScoreContainer } from './ResultsSimple';

const IndicatorComponentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  > * {
    width: 100%;
  }
`;

const IndicatorsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
`;

interface Indicator2ValuesProps {
  result: Indicator2Values;
}

const IndicatorWrapper = styled.div<{ highlighted?: boolean }>`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 6px 12px;
  background-color: ${(props) =>
    props.highlighted ? 'var(--results-section-bg)' : 'lightgrey'};
  box-shadow: ${(props) =>
    props.highlighted ? '0px 0px 6px rgba(0, 0, 0, 0.2)' : 'none'};
  transition: all 0.3s ease-in-out;

  > b {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 4px;
    color: ${(props) => (props.highlighted ? 'black' : '#2f2f2f')};
  }

  > span {
    font-size: 10px;
    font-weight: 400;
    line-height: 1.25;
    color: black;
  }
`;

const Indicator2ValuesComponent = ({ result }: Indicator2ValuesProps) => {
  return (
    <IndicatorComponentContainer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <TitleScoreContainer>
          <p>{result.title}</p>
        </TitleScoreContainer>
      </div>
      <IndicatorsWrapper>
        <IndicatorWrapper highlighted>
          <b>
            {Math.round(
              Number(result.displayed_number1 || result.number1) || 0,
            )}
          </b>{' '}
          <span>{result.displayed_unit1 || result.unit1 || ''}</span>
        </IndicatorWrapper>
        <IndicatorWrapper>
          <b>
            {Math.round(
              Number(result.displayed_number2 || result.number2) || 0,
            )}
          </b>{' '}
          <span>{result.displayed_unit2 || result.unit2 || ''}</span>
        </IndicatorWrapper>
      </IndicatorsWrapper>
    </IndicatorComponentContainer>
  );
};

export default Indicator2ValuesComponent;
