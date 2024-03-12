import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { StateType } from './context/useBackTo';

interface BackToComponentProps {
  state: StateType;
}

const Container = styled.div`
  background: var(--lightgreen);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const BackToComponent = ({ state }: BackToComponentProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!state.pathname) return;
    navigate(state.pathname);
  };
  return (
    <Container>
      <p>Complétez la fiche puis </p>
      <Button size="small" onClick={handleClick}>
        Retourner vers {state.name}
      </Button>
    </Container>
  );
};

export default BackToComponent;
