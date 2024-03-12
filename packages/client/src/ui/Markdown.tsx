import styled from '@emotion/styled';
import React from 'react';

import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
}

const MarkdownContainer = styled.div`
  white-space: pre-wrap;
`;

const Markdown = ({ children }: MarkdownProps) => {
  return (
    <MarkdownContainer>
      <ReactMarkdown components={{ p: React.Fragment }}>
        {children.replaceAll('\n', '\n&nbsp;')}
      </ReactMarkdown>
    </MarkdownContainer>
  );
};

export default Markdown;
