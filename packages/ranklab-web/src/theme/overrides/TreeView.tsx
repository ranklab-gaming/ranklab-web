import { Theme } from "@mui/material/styles"
import Iconify from "src/components/Iconify"

// ----------------------------------------------------------------------

const ICON_SIZE = { width: 20, height: 20 }

export default function TreeView(theme: Theme) {
  return {
    MuiTreeView: {
      defaultProps: {
        defaultCollapseIcon: (
          <Iconify icon="eva:minus-square-outline" {...ICON_SIZE} />
        ),
        defaultExpandIcon: (
          <Iconify icon="eva:close-square-outline" {...ICON_SIZE} />
        ),
        defaultEndIcon: (
          <Iconify
            icon="eva:close-square-outline"
            {...ICON_SIZE}
            sx={{ color: "text.secondary" }}
          />
        ),
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        label: { ...theme.typography.body2 },
        iconContainer: { width: "auto" },
      },
    },
  }
}
