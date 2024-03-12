import styled from '@emotion/styled';

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  justify-content: flex-start;
  gap: 16px;
  align-items: stretch;
  flex-grow: 1;
`;

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: bold;
  font-size: 18px;
`;

export const BlockContent = styled.div`
  background-color: ${({ color }) => color};
  padding: 16px;
  display: flex;
  flex-direction: row;
  border-radius: 16px;
  gap: 16px;
  width: 100%;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: row wrap;
  align-content: flex-start;

  .one-line & {
    height: 180px;
    flex-grow: 0;
  }
`;
