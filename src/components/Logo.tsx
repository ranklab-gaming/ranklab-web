import React from 'react';
// material
import { Icon } from '@iconify/react';
import { Box, BoxProps } from '@material-ui/core';
import flaskOutlineIcon from '@iconify/icons-mdi/flask-outline';
import { useTheme } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

const Logo = React.forwardRef<any, BoxProps>(({ sx }, ref) => {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;

  return (
    <Box ref={ref} sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}>
      <Icon icon={flaskOutlineIcon} color={PRIMARY_MAIN} fontSize="40px" />
    </Box>
  );
});

export default Logo;
