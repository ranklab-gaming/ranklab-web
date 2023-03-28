import { Popover, PopoverProps } from "@mui/material"
import { styled } from "@mui/material/styles"

type Arrow =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom"

type ArrowStyleProps = {
  arrow: Arrow
}

const ArrowStyle = styled("span")<ArrowStyleProps>(({ arrow, theme }) => {
  const size = 12
  const position = -(size / 2)
  const borderStyle = `solid 1px ${theme.palette.grey[500_12]}`

  const topStyle = {
    borderRadius: "0 0 3px 0",
    top: position,
    borderBottom: borderStyle,
    borderRight: borderStyle,
  }

  const bottomStyle = {
    borderRadius: "3px 0 0 0",
    bottom: position,
    borderTop: borderStyle,
    borderLeft: borderStyle,
  }

  const leftStyle = {
    borderRadius: "0 3px 0 0",
    left: position,
    borderTop: borderStyle,
    borderRight: borderStyle,
  }

  const rightStyle = {
    borderRadius: "0 0 0 3px",
    right: position,
    borderBottom: borderStyle,
    borderLeft: borderStyle,
  }

  return {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      zIndex: 1,
      width: size,
      height: size,
      content: "''",
      display: "block",
      position: "absolute",
      transform: "rotate(-135deg)",
      background: theme.palette.background.paper,
    },
    ...(arrow === "top-left" && { ...topStyle, left: 20 }),
    ...(arrow === "top-center" && {
      ...topStyle,
      left: 0,
      right: 0,
      margin: "auto",
    }),
    ...(arrow === "top-right" && { ...topStyle, right: 20 }),
    ...(arrow === "bottom-left" && { ...bottomStyle, left: 20 }),
    ...(arrow === "bottom-center" && {
      ...bottomStyle,
      left: 0,
      right: 0,
      margin: "auto",
    }),
    ...(arrow === "bottom-right" && { ...bottomStyle, right: 20 }),
    ...(arrow === "left-top" && { ...leftStyle, top: 20 }),
    ...(arrow === "left-center" && {
      ...leftStyle,
      top: 0,
      bottom: 0,
      margin: "auto",
    }),
    ...(arrow === "left-bottom" && { ...leftStyle, bottom: 20 }),
    ...(arrow === "right-top" && { ...rightStyle, top: 20 }),
    ...(arrow === "right-center" && {
      ...rightStyle,
      top: 0,
      bottom: 0,
      margin: "auto",
    }),
    ...(arrow === "right-bottom" && { ...rightStyle, bottom: 20 }),
  }
})

interface Props extends PopoverProps {
  arrow?: Arrow
  disabledArrow?: boolean
}

export const MenuPopover = ({
  children,
  arrow = "top-right",
  disabledArrow,
  sx,
  ...other
}: Props) => {
  return (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          p: 1,
          width: 200,
          overflow: "inherit",
          ...sx,
        },
      }}
      {...other}
    >
      {!disabledArrow && <ArrowStyle arrow={arrow} />}
      {children}
    </Popover>
  )
}
