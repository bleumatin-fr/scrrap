import styled from '@emotion/styled';
import React from 'react';
import { GraphTitle } from './ResultGraph';

const GlobalScoreContainer = styled.div`
  width: 100%;
  background-color: transparent;
  position: relative;
  margin: 16px 0;
  > div:last-of-type {
    margin-top: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    > p {
      flex: 1;
    }
    > p:first-of-type {
      text-align: center;
      background: var(--bg-score);
      padding: 6px 0;
      border-radius: 24px;
    }
  }
`;

interface GlobalScoreComponentProps {
  title?: string;
  subtitle?: string;
  score?: string;
  children: React.ReactNode;
  dashboard?: boolean;
}

const GlobalScoreComponent = ({
  title,
  score,
  subtitle,
  children,
  dashboard,
}: GlobalScoreComponentProps) => {
  if (dashboard) {
    return (
      <div>
        <p className="h5r">{title}</p>
        <p className="h3b">{score}</p>
      </div>
    );
  }
  return (
    <GlobalScoreContainer>
      {title && <GraphTitle text={title} size="full" color="default"/>}
      {subtitle && <p className="h6r">{subtitle}</p>}
      <div>
        <p className="h3b">{score}</p>
        {children}
      </div>
    </GlobalScoreContainer>
  );
};

export default GlobalScoreComponent;
