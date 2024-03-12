import styled from '@emotion/styled';
import { Indicator, Model, Pie1D, Project, Result } from '@scrrap/core';
import Explanation from './Explanation';
import Illustration, { getIllustration } from './Illustration';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 0 0 32px;
  border-bottom: 5px solid black;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 32px;
  }
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const getIndicator = (results: Result[], model: Model) => {
  let indicator = results.find(
    (result) =>
      'code' in result &&
      result.code === model.config.results.mainIndicatorCode,
  );
  return indicator || null;
};

const getResultsByCategories = (results: Result[], model: Model) => {
  return results.find(
    (result) =>
      'code' in result && result.code === model.config.results.mainPieCode,
  );
};

const ResultsSynthesis = ({
  project,
  results,
  model,
}: {
  project: Project;
  results: Result[];
  model: Model;
}) => {
  const indicator = getIndicator(results, model);

  const illustration = getIllustration(indicator as Indicator);

  if (!illustration) return null;

  const resultsByCategories = getResultsByCategories(results, model);

  return (
    <Container style={{ backgroundColor: illustration.color }}>
      <Header>
        <div>
          {indicator && (
            <SynthesisIndicator
              indicator={indicator as Indicator}
              backgroundColor="black"
              color={illustration.color}
            />
          )}
        </div>
        <p className="hxr">
          * Global unit for measuring GHG emissions (Greenhouse Gases). GHGs
          other than CO2 are converted into “CO2 equivalent” according to their
          warming power.
        </p>
      </Header>
      <Main>
        {resultsByCategories && (
          <Explanation
            resultsByCategories={resultsByCategories as Pie1D}
            project={project}
          />
        )}
        <Illustration
          illustration={illustration}
          indicator={indicator as Indicator}
        />
      </Main>
    </Container>
  );
};

const IndicatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  > div {
    border-radius: 32px;
    padding: 8px 16px;
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }
  > p {
    color: black;
  }
`;

const SynthesisIndicator = ({
  indicator,
  backgroundColor,
  color,
}: {
  indicator: Indicator;
  backgroundColor: string;
  color: string;
}) => {
  return (
    <IndicatorContainer>
      <div style={{ backgroundColor: backgroundColor, color: color }}>
        <p className="h2b">{indicator.number || 0}</p>
        <p className="h2r">{indicator.unit || ''}</p>
        <p className="h5r">*</p>
      </div>
    </IndicatorContainer>
  );
};

export default ResultsSynthesis;
