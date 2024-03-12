import styled from '@emotion/styled';
import { Subtitle, Title } from '@scrrap/core';
import { SectorHeaderWrapper } from '../project/Project';
import { IconContainer, scopeIcons } from './ResultsSimple';

const SectionTitleContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: black;
  margin-bottom: 16px;
  background-color: black;
  color: white;
  .result_anchor {
    visibility: hidden;
    position: absolute;
    top: -48px;
  }
  svg {
    fill: white;
  }
`;

const SectionTitle = ({ result }: { result: Title }) => {
  const icon = scopeIcons[result.icon!];
  return (
    <SectionTitleContainer>
      <div id={`results_${result.icon}`} className="result_anchor"></div>
      <IconContainer>{icon}</IconContainer>
      <p className="h4b">{result.text}</p>
    </SectionTitleContainer>
  );
};

const SectionSubtitleContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 16px 0;
  background-color: transparent;
  > div {
    margin-bottom: 0 !important;
  }
`;

export const SectionSubtitle = ({ result }: { result: Subtitle }) => {
  return (
    <SectionSubtitleContainer>
      <SectorHeaderWrapper
        backgroundColor={'var(--dark-grey)'}
        className={`level0`}
        style={{zIndex: "1"}}
      >
        <p className="h4b">{result.text}</p>
      </SectorHeaderWrapper>
    </SectionSubtitleContainer>
  );
};

export default SectionTitle;
