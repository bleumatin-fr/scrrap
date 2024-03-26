import styled from '@emotion/styled';
import { Indicator } from '@scrrap/core';

import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { IconContainer, scopeIcons } from './ResultsSimple';

import { TitleScoreContainer } from './ResultsSimple';

const IndicatorComponentContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 16px;
  row-gap: 4px;
`;

const IndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
`;

interface IndicatorProps {
  result: Indicator;
}

const IndicatorComponent = ({ result }: IndicatorProps) => {
  const icon = scopeIcons[result.code!] ?? (
    <img src={`${process.env.REACT_APP_BASENAME}/action.png`} alt="action" />
  );
  return (
    <IndicatorComponentContainer>
      <IconContainer>{icon}</IconContainer>
      <TitleScoreContainer>
        <p>
          {result.title}
          {result.description && (
            <Tooltip title={result.description}>
              <IconButton size="small">
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </p>
      </TitleScoreContainer>
      <IndicatorWrapper>
        <p className="h3r">
          <b>{result.number || 0}</b>{' '}
          <span className="hzr">{result.unit || ''}</span>
        </p>
      </IndicatorWrapper>
    </IndicatorComponentContainer>
  );
};

export default IndicatorComponent;
