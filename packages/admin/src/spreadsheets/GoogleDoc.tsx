import styled from '@emotion/styled';
import { useRecordContext } from 'react-admin';

import classNames from 'classnames';

const GoogleContainer = styled.div`
  position: absolute;
  top: calc(16px + 48px);
  bottom: 16px;
  right: 16px;
  left: 58px;
  height: calc(100vh - 16px - 48px - 16px);

  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  z-index: 1200;

  &.fullscreen {
    top: 50px;
    bottom: 0;
    right: 0;
    left: 0;
    height: calc(100vh - 50px);
  }

  &.sidebar-opened {
    left: 160px;
  }

  iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
`;

const GoogleDoc = ({ className }: { className: string }) => {
  const document = useRecordContext();

  if (!document) {
    return null;
  }

  return (
    <GoogleContainer
      className={classNames({
        [className]: true,
      })}
    >
      <iframe title={document.title} src={document.link}></iframe>
    </GoogleContainer>
  );
};

export default GoogleDoc;
