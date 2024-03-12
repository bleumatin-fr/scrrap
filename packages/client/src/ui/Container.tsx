import styled from '@emotion/styled';

interface ContainerProps {
  noGap?: boolean;
}

//DESIGNED FOR ACTION & RESULT PAGES
export const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 24px auto;
  background-color: var(--light-grey);
  display: flex;
  gap: ${({ noGap }: ContainerProps) => (noGap ? '0px' : '16px')};
  flex-direction: column;
`;
