import styled from '@emotion/styled';
import { Sector } from '@scrrap/core';
import { Helmet } from 'react-helmet';
import { useLocation, useParams } from 'react-router-dom';

import ResultsSimple from '../results/ResultsSimple';
import { getProjectTitle, useProject } from './context/useProject';
import Nav from './Nav';
import Parameters from './Parameters';

import React, { useEffect, useState } from 'react';
import BackToComponent from './BackToComponent';
import useBackTo from './context/useBackTo';
import { ReactComponent as BaseLoadingIllustration } from './images/water-crops.svg';

interface SimulatorOptions {
  secondaryNav: boolean;
}

const simulatorOptions = {
  secondaryNav: false,
};

const Container = styled.div`
    width: 100%;
    background-color: var(--backgroundColor);
    display: flex;
    gap: 16px;
    padding: 0;
    @media (max-width: 1400px) {
      padding: 0 16px;
    }
  }
`;

type SectorComponentWrapperProps = {
  depth: number;
};

const SectorComponentWrapper = styled.div`
  margin-bottom: ${(props: SectorComponentWrapperProps) =>
    props.depth === 0 ? '16px' : '0px'};
  background-color: white;
`;

const LeftColumn = styled.div`
  width: min(65%, calc(100% - 400px));
  position: sticky;
  top: 0px;
`;

const RightColumn = styled.div`
  width: max(35%, 400px);
  height: calc(100vh - 164px);
  position: sticky;
  overflow: auto;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectorWrapper = styled.div`
  width: 100%;
  background-color: white;
  padding: 0 16px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 184px;
  button {
    margin-top: 40px;
  }
`;

const LoadingIllustration = styled(BaseLoadingIllustration)`
  width: 600px;
  filter: grayscale(95%) brightness(120%);
  opacity: 0.8;
`;

export const Loading = () => (
  <LoadingContainer>
    <LoadingIllustration />
    <p className="h2b">Formulaire en cours de préparation...</p>
  </LoadingContainer>
);

// HeaderContainer is necessary to mask the parameters when scrolling
const HeaderContainer = styled.div`
  background-color: var(--backgroundColor);
  padding-top: 16px;
  position: sticky;
  top: 0px;
  z-index: 120;
`;

// NavContainer is used to display the margin between Nav and Parameters
const NavContainer = styled.div`
  background-color: white;
`;

const MainContainer = styled.div`
  padding: 0;
  background-color: var(--backgroundColor);
`;

export const ProjectForm = () => {
  const { projectId } = useParams();
  const { project, loading } = useProject(projectId);
  const { state: backToState, setState: setBackTo } = useBackTo();
  const location = useLocation();

  useEffect(() => {
    const scrollTo = (location.state as any)?.scrollTo;
    if (scrollTo) {
      const element = document.querySelector(scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!projectId) return;
    if (backToState && !backToState?.value) {
      setBackTo({
        ...backToState,
        value: projectId,
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!project) return null;

  const projectTitle = getProjectTitle(project);

  return (
    <Container data-tour="project-form">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${projectTitle} - SCRRAP`}</title>
      </Helmet>
      <LeftColumn>
        <HeaderContainer>
          <NavContainer>
            {backToState && backToState.value === projectId && (
              <BackToComponent state={backToState} />
            )}
            <Nav />
          </NavContainer>
        </HeaderContainer>
        <MainContainer>
          <SectorWrapper>
            <SectorComponent
              sectors={project?.sectors}
              depth={0}
              upperSector={null}
              options={simulatorOptions}
            />
          </SectorWrapper>
        </MainContainer>
      </LeftColumn>
      <RightColumn>
        <ResultsSimple results={project?.results} loading={loading} />
      </RightColumn>
    </Container>
  );
};

export const ScrollToTopOnce = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const ScrollHandleContainer = styled.div`
  position: relative;
  top: -200px;
`;

export const ScrollHandle = React.forwardRef<HTMLDivElement, any>(
  (props, ref) => {
    const [top, setTop] = useState(0);

    useEffect(() => {
      const categoriesWrapper = document.querySelector('.categories_wrapper');
      if (!categoriesWrapper) return;
      const bottom = categoriesWrapper.getBoundingClientRect().bottom;
      setTop(bottom + (props.offset || 0) + 20);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <ScrollHandleContainer
        {...props}
        ref={ref}
        style={{ top: -top }}
      ></ScrollHandleContainer>
    );
  },
);

const SectorComponent = ({
  sectors,
  depth,
  upperSector,
  options,
}: {
  sectors?: Sector[];
  depth: number;
  upperSector: Sector | null;
  options: SimulatorOptions;
}) => {
  const { projectId } = useParams();
  const { project, updateParameter } = useProject(projectId);

  if (!project) {
    return null;
  }

  const getSectorId = (
    sector: Sector,
    upperSector: Sector | null,
    depth: number,
  ) => {
    return upperSector && depth > 0
      ? `${upperSector.information.name}-${sector.information.name}-${depth}`.replace(
          /\W/g,
          '_',
        )
      : `${sector.information.name}-${depth}`.replace(/\W/g, '_');
  };

  return (
    <>
      {(sectors || []).map((sector) => {
        const displayHeader =
          sector.parameters.length > 0 || sector.sectors.length > 0;
        const sectorId = getSectorId(sector, upperSector, depth);

        return (
          <SectorComponentWrapper
            key={`${sector.information.name}-${depth}`}
            depth={depth}
          >
            <ScrollHandle id={sectorId}></ScrollHandle>
            {displayHeader && (
              <SectorHeader
                upperSector={upperSector}
                sector={sector}
                depth={depth}
                information={sector.information}
                subsectors={sector.sectors}
                sectorId={sectorId}
                options={options}
                externalModules={
                  project.model.config.parameters.externalModules
                }
              />
            )}
            {sector.parameters.length > 0 && (
              <Parameters
                autofocusFirst={false}
                parameters={sector.parameters}
                onUpdateParameter={updateParameter}
              />
            )}
            {sector.sectors.length > 0 && (
              <SectorComponent
                sectors={sector.sectors}
                depth={depth + 1}
                upperSector={sector}
                options={options}
              />
            )}
          </SectorComponentWrapper>
        );
      })}
    </>
  );
};

type SectorHeaderWrapperProps = {
  backgroundColor: string;
};

export const SectorHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 16px;
  color: black;
  justify-content: space-between;
  &.level0 {
    top: 153px;
    position: sticky;
    padding: 14px 16px;
    background-color: ${(props: SectorHeaderWrapperProps) =>
      props.backgroundColor || 'lightgrey'};
    color: white;
    z-index: 110;
  }
  &.level0 p {
    color: ${(props: SectorHeaderWrapperProps) =>
      contrastColor(props.backgroundColor) || 'black'};
  }
  &.level1 {
    width: 100%;
    padding: 16px 0 16px 20px;
    top: 200px;
    background-color: white;
    position: sticky;
    z-index: 100;
  }
  &.level1 p {
    line-height: 18px;
  }
  &.level1 p::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background-color: ${(props: SectorHeaderWrapperProps) =>
      props.backgroundColor || 'lightgrey'};
    left: 0;
    display: block;
    line-height: 18px;
    margin-top: 1px;
  }
  &.level2 p {
    // font-style: italic;
  }
`;

const headerClassName: { [key: number]: string } = {
  0: 'h4b',
  1: 'h5b',
  2: 'hxc',
};

interface SectorHeaderProps {
  sector: Sector;
  upperSector: Sector | null;
  depth: number;
  sectorId: string;
  information: {
    color: string;
    name: string;
  };
  subsectors: Sector[];
  options: SimulatorOptions;
  externalModules?: {
    [key: string]: string[];
  };
}

// https://stackoverflow.com/a/72595895/1665540
const contrastColor = (backgroundColor: string) => {
  try {
    return ['black', 'white'][
      ~~(
        [1, 3, 5]
          .map((p) => parseInt(backgroundColor.substr(p, 2), 16))
          .reduce((r, v, i) => [0.299, 0.587, 0.114][i] * v + r, 0) < 128
      )
    ];
  } catch (e) {
    return 'black';
  }
};

const SectorHeader = ({
  sector,
  upperSector,
  depth,
  information,
  sectorId,
  subsectors,
  options,
  externalModules,
}: SectorHeaderProps) => {
  // if (depth > 0) return null;
  const { color, name } = information;

  const finalName = depth !== 1 ? name.toLocaleUpperCase() : name;

  return (
    <>
      <SectorHeaderWrapper backgroundColor={color} className={`level${depth}`}>
        <p className={headerClassName[depth]}>{finalName}</p>
      </SectorHeaderWrapper>
    </>
  );
};
