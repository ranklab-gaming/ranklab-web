import { Theme } from "@mui/material/styles"
import {
  TreeViewCollapseIcon,
  TreeViewEndIcon,
  TreeViewExpandIcon,
} from "../icons"

export function TreeView(theme: Theme) {
  return {
    MuiTreeView: {
      defaultProps: {
        defaultCollapseIcon: (
          <TreeViewCollapseIcon sx={{ width: 20, height: 20 }} />
        ),
        defaultExpandIcon: (
          <TreeViewExpandIcon sx={{ width: 20, height: 20 }} />
        ),
        defaultEndIcon: (
          <TreeViewEndIcon
            sx={{ color: "text.secondary", width: 20, height: 20 }}
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
