import { useNavigate, useParams } from 'react-router-dom';

import { Result } from '@scrrap/core';

import { PageContainer } from '../ui/Container';
import { Abacus } from './ScoreCardComponent';

import { useProject } from '../project/context/useProject';

import styled from '@emotion/styled';
import Bar1DComponent, { Bar1DLegend } from './Bar1DComponent';

import BarSingle1DComponent, {
  BarSingle1DLegend,
} from './BarSingle1DComponent';
import BarStacked1DComponent from './BarStacked1DComponent';
import BarStacked2DComponent from './BarStacked2DComponent';
import GlobalScoreComponent from './GlobalScore';
import NavComponent from './Nav';
import Pie1DComponent, { Pie1DLegend } from './Pie1DComponent';
import ResultGraph from './ResultGraph';
import ResultsSynthesis from './ResultsSynthesis';
import SectionTitle, { SectionSubtitle } from './SectionTitle';
import TreemapComponent from './TreemapComponent';

export const ResultsContainer = styled.div`
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: var(--light-grey);
`;

export const TitleBlock = styled.div`
  background-color: black;
  padding: 16px;
  width: 100%;
  h,
  p {
    color: white;
  }
`;

const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px;
`;

const getResultsByCategories = (results: Result[]) => {
  let resultsByCategories: Result[][] = [];
  let categoryResults: Result[] = [];
  results.forEach((result) => {
    if (result.type === 'title' && categoryResults.length > 0) {
      resultsByCategories.push(categoryResults);
      categoryResults = [result];
    } else {
      categoryResults.push(result);
    }
  });
  if (categoryResults.length > 0) resultsByCategories.push(categoryResults);
  return resultsByCategories;
};

const Results = () => {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const navigate = useNavigate();

  if (!project) {
    return null;
  }

  const results = project.results.filter(
    (result: Result) => result.scope === 'complete',
  );

  const resultsByCategories = getResultsByCategories(results);

  return (
    <PageContainer noGap>
      <TitleBlock style={{ marginBottom: '32px' }}>
        <p className="h3b">{project.name} - Résultats complets</p>
        <p className="hxr">
          Découvrez l'impact détaillé de votre activité
        </p>
      </TitleBlock>
      {/* <ResultsSynthesis
        results={project.results}
        model={project.model}
        project={project}
      /> */}
      {resultsByCategories.length > 0 && (
        <ResultsContainer>
          {resultsByCategories.map((results: Result[]) => (
            <CategoryContainer>
              {results.map((result: Result, index: number) => (
                <ResultDispatch result={result} key={index} />
              ))}
            </CategoryContainer>
          ))}
        </ResultsContainer>
      )}
    </PageContainer>
  );
};

export const ResultDispatch = ({
  result,
  dashboard,
}: {
  result: Result;
  dashboard?: boolean;
}) => {
  switch (result.type) {
    case 'nav':
      return <NavComponent result={result} />;
    case 'title':
      return <SectionTitle result={result} />;
    case 'subtitle':
      return <SectionSubtitle result={result} />;
    case 'globalScore':
      return (
        <GlobalScoreComponent
          title={result.title!}
          subtitle={result.subtitle}
          score={result.score}
          dashboard={dashboard}
        >
          <p className="hxr">{result.text}</p>
        </GlobalScoreComponent>
      );
    case 'scoreCard':
      return (
        <GlobalScoreComponent title={result.title!} score={result.score}>
          {result.display! ? (
            <Abacus result={result} visible={result.display!} />
          ) : (
            <p>
              Votre score sera affiché dès que vous aurez répondu aux premières
              questions associés. Il est également possible que vous ne soyez
              pas concerné.
            </p>
          )}
        </GlobalScoreComponent>
      );
    case 'treemap':
      return (
        <ResultGraph
          result={result}
          graph={<TreemapComponent result={result} />}
        />
      );
    case 'pie1D':
      if (dashboard) {
        return <Pie1DComponent result={result} />;
      }
      return (
        <ResultGraph
          result={result}
          graph={<Pie1DComponent result={result} />}
          legend={<Pie1DLegend result={result} />}
        />
      );
    case 'bar1D':
      return (
        <ResultGraph
          result={result}
          graph={<Bar1DComponent result={result} />}
          legend={<Bar1DLegend result={result} />}
        />
      );
    case 'barSingle1D': {
      const fullWidth = (result?.data?.data?.length || 0) > 3;
      return (
        <ResultGraph
          result={result}
          fullWidth={fullWidth}
          graph={<BarSingle1DComponent result={result} />}
          legend={<BarSingle1DLegend result={result} />}
        />
      );
    }
    case 'barStacked1D': {
      const fullWidth = (result?.data?.data?.length || 0) > 3;
      return (
        <ResultGraph
          result={result}
          fullWidth={fullWidth}
          graph={<BarStacked1DComponent result={result} />}
        />
      );
    }
    case 'barStacked2D':
      return (
        <ResultGraph
          result={result}
          graph={<BarStacked2DComponent result={result} />}
        />
      );
  }
  return null;
};

export default Results;
