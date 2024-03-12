import styled from '@emotion/styled';
import { ReactComponent as Add } from '../../../ui/icons/add.svg';

const IconContainer = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
`;

const NewProjectButtonDashboardContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`;

const NewProjectButtonDashboard = ({
  onClick,
  model,
}: {
  model: string;
  onClick?: (model: string) => void;
}) => {
  return (
    <NewProjectButtonDashboardContainer>
      <IconContainer>
        <Add />
      </IconContainer>
      <p className="hxb">{model}</p>
    </NewProjectButtonDashboardContainer>
  );
};

export default NewProjectButtonDashboard;
