import { InputSelectIcon } from "../icons"

export function Select() {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: InputSelectIcon,
      },
    },
  }
}
