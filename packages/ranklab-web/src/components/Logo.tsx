import React from "react";
// material
import { useTheme } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";
import flaskOutlineIcon from "@iconify/icons-mdi/flask-outline";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

const Logo = React.forwardRef<any, BoxProps>(({ sx }, ref) => {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;

  return (
    <Box ref={ref} sx={{ width: 40, height: 40, cursor: "pointer", ...sx }}>
      <Icon icon={flaskOutlineIcon} color={PRIMARY_MAIN} fontSize="40px" />
    </Box>
  );
});

export default Logo;
