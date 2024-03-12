import styled from '@emotion/styled';
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as BaseMuiMenuItem,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { ReactComponent as Identity } from '../ui/icons/categories/infos générales.svg';
import { ReactComponent as Help } from '../ui/icons/help.svg';
import { ReactComponent as Info } from '../ui/icons/categories/info.svg';
import { ReactComponent as Material } from '../ui/icons/categories/material.svg';
import { ReactComponent as TransportGood } from '../ui/icons/categories/transport-good.svg';
import { ReactComponent as TransportPerson } from '../ui/icons/categories/transport-person.svg';
import { ReactComponent as Investment } from '../ui/icons/categories/investment.svg';
import { ReactComponent as GoodsNew } from '../ui/icons/categories/goods-new.svg';
import { ReactComponent as Purchasing } from '../ui/icons/categories/purchasing.svg';
import { ReactComponent as MachineUse } from '../ui/icons/categories/machine-use.svg';
import { ReactComponent as MachineMaintenance } from '../ui/icons/categories/machine-maintenance.svg';
import { ReactComponent as Waste } from '../ui/icons/categories/waste.svg';
import { ReactComponent as Stakeholders } from '../ui/icons/categories/stakeholders.svg';
import CompletionBar from './CompletionBar';
import CompletionDetails from './CompletionDetails';
import { getProjectTitle, useProject } from './context/useProject';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px 0;
  gap: 8px;
  .h2b {
    flex-grow: 1;
  }
`;
const Separator = styled.div`
  border-bottom: 1px solid var(--backgroundColor);
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const RightColumn = styled.div`
  font-size: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  line-height: 24px;

  svg {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const Bold = styled.span`
  font-weight: bold;
`;

const ProjectTitle = styled.p`
  color: black;
  padding: 8px 16px;
  font-weight: bold;
`;

const CategoriesWrapper = styled.div`
  position: relative;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  gap: 16px;
  flex-wrap: wrap;
  height: 62px;
`;

const MoreMenuContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const MoreButton = styled(IconButton)`
  height: 32px;
  width: 32px;
  padding: 16px;
`;

interface MenuItem {
  label: string;
  icon?: Node | null;
  color: string;
}

// https://stackoverflow.com/a/72595895/1665540
const contrastColor = (backgroundColor: string) => {
  try {
    return ['black', 'white'][
      ~~(
        [1, 3, 5]
          .map((p) => parseInt(backgroundColor.substr(p, 2), 16))
          .reduce((r, v, i) => [0.299, 0.587, 0.114][i] * v + r, 0) < 128
      )
    ];
  } catch (e) {
    return 'black';
  }
};

const MuiMenuItem = styled(BaseMuiMenuItem)`
  &:hover {
    background-color: ${({ color }: { color: string }) => color};
    color: ${({ color }: { color: string }) => contrastColor(color)};

    svg:not([fill='none']) {
      fill: ${({ color }: { color: string }) => contrastColor(color)};
    }

    svg[fill='none'] {
      stroke: ${({ color }: { color: string }) => contrastColor(color)};
    }
  }
`;

const MoreMenuItem = ({
  icon,
  label,
  color,
  handleClose,
}: {
  icon?: Node | null;
  label: string;
  color: string;
  handleClose: () => void;
}) => {
  const ref = useRef<HTMLLIElement>();

  useEffect(() => {
    if (!icon) return;
    ref.current?.appendChild(icon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MuiMenuItem
      key={label}
      color={color}
      onClick={() => {
        handleClose();
        setTimeout(() => {
          document
            ?.getElementById(`${label}-0`.replace(/\W/g, '_'))
            ?.scrollIntoView();
        });
      }}
    >
      <ListItemIcon ref={ref} sx={{height: '32px', width: "32px"}}></ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MuiMenuItem>
  );
};

const MoreMenu = ({ categoryInformation }: { categoryInformation: any[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const allButtons = Array.from(document.querySelectorAll('.nav-button'));
    const minTop = allButtons.reduce((minTop, button) => {
      const { top } = button.getBoundingClientRect();
      if (top < minTop) {
        return top;
      }
      return minTop;
    }, Number.MAX_VALUE);

    const secondLineButtons = allButtons.filter((button) => {
      const { top } = button.getBoundingClientRect();
      return top > minTop;
    });
    setMenuItems(
      secondLineButtons.map((button) => {
        return {
          label: button.textContent || '',
          icon: button.querySelector('svg')?.cloneNode(true),
          color:
            categoryInformation[
              [...(button.parentElement?.children || [])].indexOf(button)
            ].color, //getComputedStyle(button, ':hover').backgroundColor,
        };
      }),
    );
  }, [categoryInformation]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  return menuItems.length ? (
    <MoreMenuContainer>
      <MoreButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </MoreButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map(({ label, icon, color }) => (
          <MoreMenuItem
            key={label}
            label={label}
            icon={icon}
            color={color}
            handleClose={handleClose}
          />
        ))}
      </Menu>
    </MoreMenuContainer>
  ) : null;
};

const Nav = () => {
  const { projectId } = useParams();
  const { project } = useProject(projectId);
  const [anchorEl, setAnchorEl] = React.useState<HTMLOrSVGElement | null>(null);

  if (!project) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const firstCategoriesInformation = project.sectors.map(
    (sector) => sector.information,
  );

  const projectTitle = getProjectTitle(project);

  return (
    <Container>
      <TitleContainer>
        <LeftColumn>
          <ProjectTitle className="h2b">{projectTitle}</ProjectTitle>
        </LeftColumn>
        <RightColumn>
          <div>
            <p>
              <Bold>{project.completionRate}%</Bold> completed
            </p>
            <Help onClick={handleClick} />
            <CompletionDetails
              placement="bottom-end"
              uncompleted={project.uncompleted}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
            />
            <CompletionBar completion={project.completionRate} width="300px" />
          </div>
        </RightColumn>
      </TitleContainer>
      <CategoriesWrapper className="categories_wrapper">
        {firstCategoriesInformation.map(({ name, color, icon }, index) => (
          <NavButton
            key={index}
            label={name}
            color={color}
            icon={categoryIcons[icon] || <Identity />}
          />
        ))}
        <MoreMenu categoryInformation={firstCategoriesInformation}></MoreMenu>
      </CategoriesWrapper>
      <Separator />
    </Container>
  );
};

export const categoryIcons: { [key: string]: ReactElement } = {
  info: <Info />,
  material: <Material />,
  'transport-good': <TransportGood />,
  'transport-person': <TransportPerson />,
  investment: <Investment />,
  'goods-new': <GoodsNew />,
  purchasing: <Purchasing />,
  'machine-use': <MachineUse />,
  'machine-maintenance': <MachineMaintenance />,
  waste: <Waste />,
  stakeholders: <Stakeholders />
};

interface NavButtonWrapperProps {
  hoverColor?: string;
}

const NavButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  min-width: 80px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 62px;
  transition: background-color 0.2s;
  :hover,
  &.selected {
    background-color: ${({ hoverColor }: NavButtonWrapperProps) => hoverColor};
    color: ${({ hoverColor }: NavButtonWrapperProps) =>
      contrastColor(hoverColor!)};
    svg:not([fill='none']) {
      fill: ${({ hoverColor }: NavButtonWrapperProps) =>
        contrastColor(hoverColor!)};
    }
    svg[fill='none'] {
      stroke: ${({ hoverColor }: NavButtonWrapperProps) =>
        contrastColor(hoverColor!)};
    }
  }
  p {
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 32px;
  display: flex;
`;

const NavButton = ({
  label,
  icon,
  color,
}: {
  label: string;
  icon: ReactNode;
  color: string;
}) => {
  const handleButtonClicked = (hash: string) => () => {
    document?.getElementById(hash)?.scrollIntoView();
  };
  return (
    <NavButtonWrapper
      className="nav-button"
      hoverColor={color}
      onClick={handleButtonClicked(`${label}-0`.replace(/\W/g, '_'))}
      title={label}
    >
      <IconContainer>{icon}</IconContainer>
      <p className="hxr">{label}</p>
    </NavButtonWrapper>
  );
};

export default Nav;
