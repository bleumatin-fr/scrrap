import styled from '@emotion/styled';
import { Model } from '@scrrap/core';
import NewProjectButtonDashboard from './NewProjectButtonDashboard';

type EmptyBlockContentProps = {
  color: string;
};

const EmptyBlockContent = styled.div`
  flex-grow: 1;
  background-color: ${(props: EmptyBlockContentProps) => props.color};
  border-radius: 8px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-grow: 1;
  gap: 16px;
  > div {
    border: 1px dashed #000000;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    :hover {
      border: 1px solid #000000;
      cursor: pointer;
      p.hxb {
        text-decoration: underline;
      }
    }
    p {
      max-width: 80%;
      text-align: center;
    }
  }
`;

const Empty = ({
  model,
  onNewProject,
}: {
  model: Model;
  onNewProject?: (model: Model) => void;
}) => {
  return (
    <EmptyBlockContent color={model.color}>
      <div onClick={() => onNewProject && onNewProject(model)}>
        <NewProjectButtonDashboard model={model.singularName} />
        <p className="hxr">{model.description}</p>
      </div>
    </EmptyBlockContent>
  );
};

export default Empty;
