import styled from '@emotion/styled';
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import useUser from '../authentication/context/useUser';
import { getProjectTitle, useProject } from '../project/context/useProject';

import { ReactComponent as Export } from '../ui/icons/export.svg';
import { ReactComponent as Home } from '../ui/icons/home.svg';
import { ReactComponent as Next } from '../ui/icons/next.svg';

import ShareProject from '../project/ShareProject';

import Tooltip from '@mui/material/Tooltip';

import { Project, ProjectUser } from '@scrrap/core';
import UserMenu from './UserMenu';

export const HeaderContainer = styled.header`
  background-color: var(--color-main);
  height: 92px;
  width: 100%;
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
  top: 0;
  color: black;
  z-index: 80;
`;

export const LogoWrapper = styled.img`
  max-width: 100%;
  max-height: 90%;
  cursor: pointer;
`;

export const HeaderProject = () => {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const { user } = useUser();
  const isShareProject = project?.users.some(
    (u: ProjectUser) => u.id === user?._id && u.role === 'owner',
  );
  return (
    <HeaderContainer>
      <HeaderSection>
        {project && <ProjectBreadcrumb project={project!} />}
      </HeaderSection>
      <HeaderSection marginBetween="16px">
        {isShareProject && project && <ShareButton project={project} />}
        <UserMenu />
      </HeaderSection>
    </HeaderContainer>
  );
};

export const HeaderProjects = () => {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <HeaderSection>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            cursor: 'pointer',
            alignItems: 'center',
            height: "100%"
          }}
          onClick={() => navigate('/')}
        >
          {/* <p className="h6r">CHUTO-CALCULATOR</p> */}
          <LogoWrapper
            src={`${process.env.REACT_APP_BASENAME}/logo-talm.png`}
            alt="logo talm"
          />
          <LogoWrapper
            src={`${process.env.REACT_APP_BASENAME}/logo-pk.png`}
            alt="logo pk"
          />
        </div>
      </HeaderSection>
      <HeaderSection>
        <p className='h2b'>SCRRAP</p>
      </HeaderSection>
      <HeaderSection>
        <UserMenu />
      </HeaderSection>
    </HeaderContainer>
  );
};

const ProjectBreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  * {
    fill: black;
  }
`;

const ProjectBreadcrumb = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectTitle = getProjectTitle(project);
  const isResults = location.pathname.includes('/results');
  const isPlanning = location.pathname.includes('/planning');
  const isProject = !isResults && !isPlanning;
  return (
    <ProjectBreadcrumbWrapper>
      <IconContainer
        onClick={() => navigate('/')}
        style={{ width: '36px', height: '36px' }}
      >
        <Home style={{ width: '36px', height: '36px' }} />
      </IconContainer>
      <IconContainer>
        <Next />
      </IconContainer>
      {isProject ? (
        <p className="h4r">{projectTitle}</p>
      ) : (
        <Link to={`/project/${project._id}`} className="h4r">
          {projectTitle}
        </Link>
      )}
      {isResults && (
        <>
          <IconContainer>
            <Next />
          </IconContainer>
          <p className="h4r">Résultats complets</p>
        </>
      )}
      {isPlanning && (
        <>
          <IconContainer>
            <Next />
          </IconContainer>
          <p className="h4r">Planning</p>
        </>
      )}
    </ProjectBreadcrumbWrapper>
  );
};

type HeaderSectionProps = {
  centered?: boolean;
  marginBetween?: string;
  children: ReactNode;
};

const HeaderSectionWrapper = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
  height: 100%;
  position: ${(props: HeaderSectionProps) =>
    props.centered ? 'absolute' : ''};
  left: ${(props: HeaderSectionProps) => (props.centered ? '50%' : '')};
  transform: ${(props: HeaderSectionProps) =>
    props.centered ? 'translate(-50%, 0)' : ''};
  > *:not(:last-child) {
    margin-right: ${(props: HeaderSectionProps) =>
      props.marginBetween ? props.marginBetween : ''};
  }
`;

export const HeaderSection = ({
  marginBetween,
  centered,
  children,
}: HeaderSectionProps) => {
  return (
    <HeaderSectionWrapper marginBetween={marginBetween} centered={centered}>
      {children}
    </HeaderSectionWrapper>
  );
};

const HeaderButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ShareButton = ({ project }: { project: Project }) => {
  const [openShare, setOpenShare] = useState<boolean>(false);
  const handleShareProject = () => {
    setOpenShare(true);
  };
  return (
    <>
      <ShareProject
        open={openShare}
        onClose={() => setOpenShare(false)}
        project={project}
      />
      <Tooltip title="Partager le projet">
        <HeaderButton onClick={handleShareProject}>
          <IconContainer>
            <Export />
          </IconContainer>
          <p className="h6r">Partager</p>
        </HeaderButton>
      </Tooltip>
    </>
  );
};
