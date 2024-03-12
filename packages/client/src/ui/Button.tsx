import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)<ButtonProps>(
  ({ color = 'secondary', theme }) => {
    return {
      color: (theme.palette as any)[color].contrastText,
      background: (theme.palette as any)[color].main || '#fff',
      borderRadius: '.5rem',
      border: color === "secondary" ? 'solid 0.5px black' : 'solid 0.5px transparent',
      padding: '4px 16px',
      height: '40px',
      textTransform: 'none',
      fontSize: '18px',
      lineHeight: '18px',
      fontWeight: '500',
      fontStyle: 'normal',
      '&:hover': {
        backgroundColor: (theme.palette as any)[color].dark || '#DCEEEF',
      },
      '&:disabled': {
        backgroundColor: (theme.palette as any)[color].light || '#DCEEEF',
      },
    };
  },
);

export const AddButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: 'black',
  background: 'transparent',
  border: '1px solid black',
  marginLeft: '1px',
  marginRight: '1px',
  padding: '4px 8px',
  borderRadius: '32px',
  height: '32px',
  textTransform: 'none',
  fontSize: '13px',
  lineHeight: '20px',
  fontWeight: '600',
  fontStyle: 'normal',
  '&:hover': {
    marginLeft: 0,
    marginRight: 0,
    border: '2px solid black',
  },
}));

export const NoBorderButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: 'black',
  background: 'transparent',
  padding: '4px 16px',
  borderRadius: '32px',
  height: '32px',
  textTransform: 'none',
  fontSize: '16px',
  lineHeight: '20px',
  fontWeight: '600',
  fontStyle: 'normal',
  '&:hover': {
    background: 'transparent',
  },
}));

export const BottomBorderButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: 'black',
  background: 'transparent',
  height: '32px',
  fontWeight: '600',
  fontStyle: 'normal',
  textTransform: 'none',
  '&:hover': {
    background: 'transparent',
  },
}));

export const SortButton = styled(NoBorderButton)`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  stroke: black;

  border-radius: 0;
  border-bottom: 3px solid transparent;
  transition: all 0.5s ease-in-out;
  opacity: 0.5;

  &:hover {
    opacity: 0.8;
  }
  &.selected {
    opacity: 1;
    border-bottom-color: var(--sortButton-borderBottom-selected);
  }
  &.result {
    opacity: 1;
  }
  &.result:hover {
    opacity: 1;
    border-bottom-color: var(--sortButton-borderBottom-hover);
  }
`;

export default CustomButton;
