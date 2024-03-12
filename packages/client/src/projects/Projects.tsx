import styled from '@emotion/styled';
import TuneIcon from '@mui/icons-material/Tune';
import { Badge, MenuItem, Select, SelectChangeEvent } from '@mui/material'; // Add this import
import { Project } from '@scrrap/core';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { HeaderProjects as Header } from '../layout/Headers';
import useModels from '../project/context/useModels';
import useProjects from '../project/context/useProjects';
import CreateProject from '../project/CreateProject';
import ProjectCard from '../project/ProjectCard';
import { sortByDate } from '../project/ProjectsUtils';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import ProjectsFilters from './ProjectsFilters';

const Layout = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  flex-grow: 1;
  gap: 32px;
  width: 100%;
  background: white;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const ProjectsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 16px;
`;

const NoActivity = styled.div`
  display: flex;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Projects = () => {
  const [sortOrder, setSortOrder] = useState<String>('date');
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>(
    [],
  );

  const { projects, loading, remove, count } = useProjects();
  const { models } = useModels();
  const navigate = useNavigate();

  const uniqueTypes = uniq(projects?.map((project) => project.model.type));

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedActivityTypes(uniqueTypes);
    }
  }, [projects]);

  if (loading) {
    return <Loader fullPage />;
  }

  if (!projects || projects.length === 0) {
    return (
      <AppLayout header={<Header />}>
        {openCreateProject && (
          <CreateProject onClose={() => setOpenCreateProject(false)} />
        )}
        <Helmet>
          <title>{`SCRRAP`}</title>
        </Helmet>
        <Layout>
          <HeaderContainer>
            <p className="h2b">Mes Activités (0)</p>
          </HeaderContainer>
          <ProjectsContainer style={{justifyContent: 'center', flex: "1"}}>
            <NoActivity>
              <NoActivityText />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateProject(true)}
              >
                Créez votre première activité !
              </Button>
            </NoActivity>
          </ProjectsContainer>
        </Layout>
      </AppLayout>
    );
  }

  const handleSortChange = (event: SelectChangeEvent<String>) => {
    setSortOrder(event.target.value as string);
  };

  const handleDeleteProject = (id: string) => async (event: any) => {
    return await remove(id);
  };

  const handleActivityTypeCheckboxChange = (activityTypes: string[]) => {
    setSelectedActivityTypes(activityTypes);
  };

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const filtersCount = [
    selectedActivityTypes.length < uniqueTypes.length,
  ].filter((filter) => filter).length;

  const filteredProjects = projects.filter((project) =>
    selectedActivityTypes.includes(project.model.type),
  );

  const sortedProjects = filteredProjects!.sort((a: Project, b: Project) => {
    if (sortOrder === 'date') {
      return sortByDate(a, b);
    }
    return a.completionRate - b.completionRate;
  });

  return (
    <AppLayout header={<Header />}>
      {openCreateProject && (
        <CreateProject onClose={() => setOpenCreateProject(false)} />
      )}
      {openFilterModal && (
        <ProjectsFilters
          open={openFilterModal}
          onClose={handleCloseFilterModal}
          activityTypes={uniqueTypes}
          selectedActivityTypes={selectedActivityTypes}
          onChange={handleActivityTypeCheckboxChange}
        />
      )}
      <Helmet>
        <title>{`SCRRAP`}</title>
      </Helmet>
      <Layout>
        <HeaderContainer>
          <p className="h2b">Mes Activités ({sortedProjects.length})</p>
          <ButtonContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateProject(true)}
              sx={{ height: '56px' }}
            >
              Créer une activité
            </Button>
            <Badge badgeContent={filtersCount} color="primary">
              <Button
                variant="outlined"
                onClick={handleOpenFilterModal}
                sx={{ height: '56px' }}
                size="large"
                startIcon={<TuneIcon />}
              >
                Filtres
              </Button>
            </Badge>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              sx={{ backgroundColor: 'white', border: '1px solid black' }}
            >
              <MenuItem key={'date'} value={'date'}>
                Date de création
              </MenuItem>
              <MenuItem key={'completion'} value={'completion'}>
                Taux de complétion
              </MenuItem>
            </Select>
          </ButtonContainer>
        </HeaderContainer>
        <ProjectsContainer>
          {sortedProjects?.map((project: Project) => (
            <ProjectCard
              key={project._id.toString()}
              project={project}
              onClick={() => navigate(`/project/${project._id}`)}
              onDelete={handleDeleteProject(project._id.toString())}
            />
          ))}
        </ProjectsContainer>
      </Layout>
    </AppLayout>
  );
};

const NoActivityText = () => {
  return (
    <p className="h5r">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut magna a
      augue viverra accumsan. Praesent faucibus lacinia semper. Vestibulum vel
      risus nec erat ornare imperdiet. Phasellus sodales urna sed ligula commodo
      ultrices. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
      aliquet, nisi ac euismod feugiat, elit nisi lacinia nisi, eget lacinia
      velit arcu id erat. Nullam ornare condimentum neque, ut pellentesque mi
      commodo eu. Vivamus mi felis, facilisis vel turpis nec, gravida rhoncus
      lacus. Cras et interdum elit, non aliquam leo. Aenean eget fringilla
      purus.
    </p>
  );
};

export default Projects;
