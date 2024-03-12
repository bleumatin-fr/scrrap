import {
  Bar1D,
  BarSingle1D,
  BarStacked1D,
  BarStacked2D,
  Pie1D,
  Treemap,
} from '@scrrap/core';

import styled from '@emotion/styled';
import Markdown from '../ui/Markdown';

interface ResultGraphProps {
  result: Treemap | Pie1D | BarStacked2D | BarStacked1D | Bar1D | BarSingle1D;
  graph: JSX.Element;
  legend?: JSX.Element;
  fullWidth?: boolean;
}

interface ResultGraphContainerProps {
  size?: string;
}

const ResultGraphContainer = styled.div`
  width: ${({ size }: ResultGraphContainerProps) =>
    size === 'full' ? '100%' : '50%'};
  margin: 16px 0;
  background-color: transparent;
  //border-radius: 0 0 8px 8px;
  position: relative;
`;

interface GraphContentProps {
  fullWidth?: boolean;
}

const GraphContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin: 22px 0;
  > * {
    width: ${({ fullWidth }: GraphContentProps) =>
      fullWidth ? '100%' : 'calc(50% - 8px)'};
  }
`;

interface GraphContainerProps {
  height?: string;
  width?: string;
}

const GraphContainer = styled.div`
    height: ${({ height }: GraphContainerProps) => height};
    width: ${({ width }: GraphContainerProps) => width};
}
`;

const ResultGraph = ({
  result,
  fullWidth,
  graph,
  legend,
}: ResultGraphProps) => {
  const finalFullWidth = fullWidth || (!!result.size && result.size === "half");
  const titleSquareColor = result.size && result.size === "half" ? "light" : "default";
  const graphContainerWidth = result.size && result.size === "half" ? "90%" : "";
  const graphContainerHeight = result.size && result.size === "half" ? "200px" : "300px";
  return (
    <ResultGraphContainer
      id={result.code}
      key={result.title}
      size={result.size || 'full'}
      className='scroll_margin_top'
    >
      <GraphTitle text={result.title || ''} size={result.size || 'full'} color={titleSquareColor}/>
      {result.subtitle && <GraphSubTitle text={result.subtitle || ''} />}
      <GraphContent fullWidth={finalFullWidth}>
        {graph && <GraphContainer width={graphContainerWidth} height={graphContainerHeight}>{graph}</GraphContainer>}
        <GraphDetail fullWidth={finalFullWidth}>
          {result.description && (
            <GraphDescription text={result.description || ''} />
          )}
          {legend}
        </GraphDetail>
      </GraphContent>
    </ResultGraphContainer>
  );
};

interface GraphTitleContainerProps {
  color?: string;
}

const GraphTitleContainer = styled.p`
  display: flex;
  align-items: center;
  padding-left: 24px;
  ::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background-color: ${({ color }: GraphTitleContainerProps) =>
      color === "light" ? 'var(--results-bullet-point-light)' : 'var(--results-bullet-point)'};
    left: 0;
    display: block;
    margin-top: -5px;
  }
`;

export const GraphTitle = ({ text, size, color }: { text: string, size: string, color: string }) => {
  const className = size === 'full' ? "h5b" : "h6r";
  return (
  <GraphTitleContainer className={className} style={{ marginBottom: '6px' }} color={color}>
    {text}
  </GraphTitleContainer>
)};

const GraphSubTitle = ({ text }: { text: string }) => (
  <p>
    <Markdown>{text}</Markdown>
  </p>
);

interface GraphDetailProps {
  fullWidth?: boolean;
}

const GraphDetail = styled.div`
    display: flex;
    flex-direction: ${({ fullWidth }: GraphDetailProps) =>
      fullWidth ? 'row' : 'column'};
    gap: 16px;
    > * {
      flex: ${({ fullWidth }: GraphDetailProps) => fullWidth && '1'};
    }
}
`;

const GraphDescriptionContainer = styled.div`
    margin: 0;
    > p {
      margin-bottom: 8px;
    }
}
`;

const GraphDescription = ({ text }: { text: string }) => (
  <GraphDescriptionContainer>
    <p className="h6r underline">Description</p>
    <Markdown>{text}</Markdown>
  </GraphDescriptionContainer>
);

export default ResultGraph;
