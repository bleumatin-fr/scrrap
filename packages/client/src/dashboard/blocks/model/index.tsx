import styled from '@emotion/styled';
import { Model, ParameterInput, Project } from '@scrrap/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProjects from '../../../project/context/useProjects';
import ProjectCard from '../../../project/ProjectCard';
import { sortByDate } from '../../../project/ProjectsUtils';
import {
  BlockContainer,
  BlockContent as BaseBlockContent,
  BlockHeader,
} from '../../ui';
import CreateProjectModal from '../../../project/CreateProjectModal';
import Empty from './Empty';
import NewProjectButtonDashboard from './NewProjectButtonDashboard';

const BlockContent = styled(BaseBlockContent)`
  height: 180px;
`;

const NewProjectBlock = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #000000;
  border-radius: 8px;
  gap: 16px;
  height: 150px;
  min-width: 200px;
  cursor: pointer;

  &:hover {
    border: 1px solid #000000;
    cursor: pointer;
    p {
      text-decoration: underline;
    }
  }
`;

interface ModelBlockProps {
  model: Model;
  sortOrder?: string;
  limit?: number;
  className?: string;
}

const ModelBlock = ({ model, sortOrder, limit, className }: ModelBlockProps) => {
  const { projects, remove, count } = useProjects({
    projectType: model.type,
    limit
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!projects) {
    return <Empty model={model} />;
  }

  const sortedProjects = projects!.sort((a: Project, b: Project) => {
    if (sortOrder === 'date') {
      return sortByDate(a, b);
    }
    return a.completionRate - b.completionRate;
  });

  const handleSave = (values: ParameterInput[], modelType: string) => {
    navigate(`/project?values=${JSON.stringify(values)}&type=${modelType}`);
  };

  const handleDelete = (id: string) => async (event: any) => {
    return await remove(id);
  };

  const handleNewProjectClicked = () => {
    setOpen(true);
  };

  return (
    <>
      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        model={model}
      />
      <BlockContainer className={className}>
        <BlockHeader>
          <Link to={`/projects/${model.type}`}>
            {model.name} ({count})
          </Link>
        </BlockHeader>
        <BlockContent color={model.color}>
          {projects?.length === 0 && (
            <Empty model={model} onNewProject={handleNewProjectClicked} />
          )}
          {projects?.length > 0 && (
            <>
              <NewProjectBlock onClick={handleNewProjectClicked}>
                <NewProjectButtonDashboard model={model.singularName} />
              </NewProjectBlock>
              {sortedProjects?.map((project: Project) => (
                <ProjectCard
                  key={project._id.toString()}
                  project={project}
                  onClick={() => navigate(`/project/${project._id}`)}
                  onDelete={handleDelete(project._id.toString())}
                />
              ))}
            </>
          )}
        </BlockContent>
      </BlockContainer>
    </>
  );
};

export default ModelBlock;
