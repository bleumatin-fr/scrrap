import styled from '@emotion/styled';

import { useNavigate } from 'react-router-dom';

import Button from '../ui/Button';
import useConfiguration from '../useConfiguration';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--light-grey);
  position: relative;
`;

const Block = styled.div`
  display: flex;
  align-items: center;

  justify-content: space-between;
  height: 70%;
  width: 70%;
  padding: 16px;
  > div:first-of-type {
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
    background-color: var(--color-main);
    img {
      max-width: 90%;
      max-height: 40%;
    }
  }
  > div:last-of-type {
    flex: 1;
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const Home = () => {
  const { configuration } = useConfiguration();
  const navigate = useNavigate();

  return (
    <Container>
      <Block>
        <div>
          <img alt="Logo" src="/logo-talm.png" />
          <img alt="Logo" src="/logo-pk.png" />
        </div>
        <div>
          <MessageContainer
            dangerouslySetInnerHTML={{
              __html: configuration['home.welcomeMessage'],
            }}
          ></MessageContainer>
          <Button
            variant="contained"
            onClick={() => navigate(`/authentication/register`)}
            color="primary"
          >
            Je crée mon compte
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/authentication/login`)}
            color="secondary"
          >
            J'ai déjà un compte, me connecter
          </Button>
        </div>
      </Block>
    </Container>
  );
};

export default Home;
