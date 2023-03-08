import { Box, IconButton, IconButtonProps } from "@mui/material"
import { m } from "framer-motion"
import { PropsWithChildren } from "react"

interface AnimateWrapProp extends PropsWithChildren {
  size: "small" | "medium" | "large"
}

const smallVariant = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
}

const mediumVariant = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 },
}

const largeVariant = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 },
}

function AnimateWrap({ size, children }: AnimateWrapProp) {
  const isSmall = size === "small"
  const isLarge = size === "large"

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={
        (isSmall && smallVariant) || (isLarge && largeVariant) || mediumVariant
      }
      sx={{
        display: "inline-flex",
      }}
    >
      {children}
    </Box>
  )
}

export function IconButtonAnimate({
  children,
  size = "medium",
  ...other
}: IconButtonProps) {
  return (
    <AnimateWrap size={size}>
      <IconButton size={size} {...other}>
        {children}
      </IconButton>
    </AnimateWrap>
  )
}
