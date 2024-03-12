import styled from '@emotion/styled';
import { ReactNode } from 'react';

const Container = styled.div`
  width: min(1800px, 100%);
`;

const Main = styled.main`
  width: 100%;
  height: calc(100vh - 92px);
  overflow: auto;
  overflow-x: visible;
`;

interface AppLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

const AppLayout = ({ header, children }: AppLayoutProps) => {
  return (
    <Container>
      {header}
      <Main>{children}</Main>
    </Container>
  );
};

export default AppLayout;
