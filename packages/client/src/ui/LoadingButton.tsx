import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { styled } from '@mui/material/styles';

const CustomButton = styled(LoadingButton)<LoadingButtonProps>(
  ({ color = 'secondary', theme }) => ({
    color: (theme.palette as any)[color].contrastText,
      background: (theme.palette as any)[color].main || '#fff',
      borderRadius: '.5rem',
      border: color === "secondary" ? 'solid 0.5px black' : 'solid 0.5px transparent',
    padding: '4px 16px',
    height: '40px',
    textTransform: 'none',
    fontSize: '16px',
    lineHeight: '20px',
    fontWeight: '600',
    fontStyle: 'normal',
    '&:hover': {
      backgroundColor: (theme.palette as any)[color].dark || '#DCEEEF',
    },
    '&:disabled': {
      backgroundColor: (theme.palette as any)[color].light || '#DCEEEF',
    },
  }),
);

export default CustomButton;
