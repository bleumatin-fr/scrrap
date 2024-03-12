import styled from '@emotion/styled';
import { Paper, Popper } from '@mui/material';
import { MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from './context/useProject';

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  padding-bottom: 24px;
`;

const Li = styled.li`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CompletionDetails = ({ onClose, ...props }: any) => {
  const { projectId } = useParams();
  const { project } = useProject(projectId);

  const handleClick =
    (parameterIndex: number) => (event: MouseEvent<HTMLLIElement>) => {
      const scrollHandle = document.getElementById(
        `parameter-${parameterIndex}`,
      );
      if (!scrollHandle) return;

      const container = scrollHandle.parentElement;
      if (!container) return;

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              container.classList.add('blink');
              setTimeout(() => {
                container.classList.remove('blink');
              }, 1600);
            }, 400);
            observer.unobserve(entry.target);
          }
        });
      });

      observer.observe(container);

      scrollHandle.scrollIntoView({ block: 'center', behavior: 'smooth' });

      onClose();
    };

  return (
    <Popper {...props} onClose={onClose}>
      <Paper style={{ padding: '24px', maxWidth: '420px' }}>
        <Title>
          {project?.uncompleted?.length === 0 && (
            <>Tous les paramètres sont complétés</>
          )}
          {project?.uncompleted?.length !== 0 && (
            <>{project?.uncompleted?.length} paramètres restant à compléter</>
          )}
        </Title>
        <ul style={{ marginLeft: '24px' }}>
          {project?.uncompleted?.slice(0, 8).map((parameter) => (
            <Li
              onClick={handleClick(parameter.index ?? -1)}
              key={parameter.index}
            >
              {parameter.name || parameter.possibleValues?.join(' / ')}
            </Li>
          ))}
          <li>...</li>
        </ul>
      </Paper>
    </Popper>
  );
};

export default CompletionDetails;
