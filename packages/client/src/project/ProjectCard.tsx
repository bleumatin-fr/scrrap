import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import { Indicator, Model, Pie1D, Project, ProjectUser } from '@scrrap/core';
import React, { MouseEvent, MouseEventHandler } from 'react';

import ShareProject from './ShareProject';

import ButtonWithConfirm from '../ui/ButtonWithConfirm';

import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import useUser from '../authentication/context/useUser';

import BaseBlock from '../ui/Block';

import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import Pie1DComponent from '../results/Pie1DComponent';
import { getParameterFromId } from './context/useProject';

interface ProjectCardProps {
  project: Project;
  onClick: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  onDelete: (event: any) => Promise<Partial<Project>>;
}

const Block = styled(BaseBlock)`
  background-color: var(--light-grey);
  height: unset;
  align-items: flex-start;
  padding: 12px;
  border: 2px solid transparent;
  cursor: pointer !important;
  transition: background-color 0.2s ease-in-out;
  position: relative;
  width: 220px;
  height: 300px;
  justify-content: unset;
  .hzr {
    font-size: 10px;
  }
  svg {
    transition: fill 0.2s ease-in-out;
  }
  > .completionWrapper {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    > div {
      flex: 1;
    }
  }
  &:hover {
    border: 2px solid black;
    .h6r {
      font-weight: bold;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  text-align: center;
`;

const Properties = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ProjectCard = ({ project, onClick, onDelete }: ProjectCardProps) => {
  const { user } = useUser();
  const [openShare, setOpenShare] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const projectTypeParam = getParameterFromId(project.sectors, [
    'Project Type',
  ]);
  const projectType =
    projectTypeParam && projectTypeParam.value
      ? projectTypeParam.value.toString()
      : undefined;

  const isShareProject = project.users.some(
    (u: ProjectUser) => u.id === user?._id && u.role === 'owner',
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await onDelete(event);
  };
  const handleShare = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpenShare(true);
  };
  return (
    <Block onClick={onClick}>
      <ShareProject
        open={openShare}
        onClose={() => setOpenShare(false)}
        project={project}
      />
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px', padding: 0 }}
        onClick={handleOpenMenu}
      >
        <Tooltip title="Options">
          <SettingsIcon />
        </Tooltip>
      </IconButton>
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <ButtonWithConfirm
            onConfirm={handleDelete}
            modalTitle={`Supprimer le projet`}
            modalContent={
              <>
                Vous êtes sur le point de supprimer le projet et toutes ses
                informations.
                <br />
                Voulez-vous vraiment supprimer ce projet ?
              </>
            }
          >
            Supprimer
          </ButtonWithConfirm>
        </MenuItem>
        {isShareProject && (
          <MenuItem onClick={handleShare}>
            <p className="hxr">Partager</p>
          </MenuItem>
        )}
      </Menu>
      <TitleContainer>
        <p className="h4b">{project.name}</p>
      </TitleContainer>
      <Properties>
        {projectType && <ProjectTypeTag label={projectType} />}
        <CircularProgressWithLabel value={project.completionRate} />
      </Properties>
      <Data project={project} />
    </Block>
  );
};

const Tag = styled.div`
  height: 32px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 80px;
  svg {
    height: 16px;
    width: 16px;
  }
  * {
    color: black;
  }
`;

export const ProjectModelTag = ({ model }: { model: Model }) => {
  return (
    <Tag style={{ backgroundColor: model.color || 'var(--light-grey)' }}>
      <p className="model-title hxr">{model.singularName}</p>
    </Tag>
  );
};

export const ProjectTypeTag = ({ label }: { label: string }) => {
  return (
    <Tag style={{ backgroundColor: 'var(--light-grey)' }}>
      <p className="model-title hxr">{label}</p>
    </Tag>
  );
};

const DataWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    text-align: center;
  }
`;

const Data = ({ project }: { project: Project }) => {
  const indicator = project.results.find(
    (result) =>
      'code' in result &&
      result.code === project.model.config.results.mainIndicatorCode &&
      result.type === 'indicator',
  ) as Indicator;
  const pieData = project.results.find(
    (result) =>
      'code' in result &&
      result.code === project.model.config.results.mainPieCode &&
      result.type === 'pie1D',
  ) as Pie1D;
  if (
    indicator &&
    'number' in indicator &&
    indicator.number !== undefined &&
    parseInt(indicator.number) === 0
  ) {
    return (
      <DataWrapper>
        <p className="hxr">Données insuffisantes</p>
        <p className="hxb">Complétez votre activité !</p>
      </DataWrapper>
    );
  }
  return (
    <DataWrapper>
      <Pie pieData={pieData} />
      <IndicatorComponent indicator={indicator} />
    </DataWrapper>
  );
};

const PieWrapper = styled.div`
  width: 100%;
  height: 123px;
  margin: 16px 0;
`;

const Pie = ({ pieData }: { pieData: Pie1D }) => {
  return (
    <PieWrapper>
      <Pie1DComponent result={pieData as Pie1D} />
    </PieWrapper>
  );
};

const IndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IndicatorComponent = ({ indicator }: { indicator: Indicator }) => {
  return (
    <IndicatorWrapper>
      <p className="h2b">{indicator.number}</p>
      <p className="hzr">{indicator.unit}</p>
    </IndicatorWrapper>
  );
};

const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number },
) => {
  const size = '32px';
  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        sx={{
          color: 'var(--light-grey)',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
        }}
      />
      <CircularProgress
        variant="determinate"
        {...props}
        size={size}
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="hzr">{`${Math.round(props.value)}%`}</p>
      </Box>
    </Box>
  );
};

export const SeeMoreProjects = ({ number }: { number: number }) => {
  return (
    <Link to="/projects" style={{ textDecoration: 'none' }}>
      <Block
        style={{
          backgroundColor: 'var(--dark-grey)',
          justifyContent: 'center',
          paddingLeft: '30px',
          textDecoration: 'none',
        }}
      >
        <p className="h1b" style={{ fontSize: '48px' }}>
          +{number}
        </p>
        <p className="h2r">{number > 1 ? 'activités' : 'activité'}</p>
      </Block>
    </Link>
  );
};

export default ProjectCard;
