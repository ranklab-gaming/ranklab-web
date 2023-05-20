import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Grow from "@mui/material/Grow"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Paper from "@mui/material/Paper"
import Popper from "@mui/material/Popper"
import {
  PropsWithChildren,
  MouseEvent as ReactMouseEvent,
  useRef,
  useState,
} from "react"

interface Props {
  href: string
  label: string
  variant?: "text" | "contained" | "outlined"
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
}

interface ItemProps {
  href: string
  label: string
}

export const SplitButtonItem = ({
  href,
  label,
}: PropsWithChildren<ItemProps>) => {
  return (
    <MenuItem href={href} component="a">
      {label}
    </MenuItem>
  )
}

export const SplitButton = ({
  href,
  label,
  variant,
  color,
  children,
}: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <ButtonGroup
        variant={variant}
        color={color}
        ref={anchorRef}
        aria-label="split button"
      >
        <Button href={href}>{label}</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
          component="a"
          title="More options"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {children}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
