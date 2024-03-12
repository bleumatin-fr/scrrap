import {
  Slider as MuiSlider,
  SliderProps,
  Stack,
  Typography,
} from '@mui/material';

type SliderInputProps = SliderProps & {
  unit: string | undefined;
};

const Slider = ({ unit, ...props }: SliderInputProps) => {
  const actualUnit = unit ? unit : '%';
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ marginBottom: '40px' }}
      alignItems="center"
    >
      <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
        {`${props.min} ${actualUnit}`}
      </Typography>
      <MuiSlider
        {...props}
        valueLabelDisplay="on"
        valueLabelFormat={(value) => `${value} ${actualUnit}`}
        sx={{
          '.MuiSlider-valueLabel': {
            transform: 'translateY(135%) scale(1) !important',
            '&:before': {
              top: -8,
            },
          },
        }}
      />
      <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
        {`${props.max} ${actualUnit}`}
      </Typography>
    </Stack>
  );
};
export default Slider;
