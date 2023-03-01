import { m, MotionProps } from "framer-motion"
import { Box, BoxProps } from "@mui/material"
import { animateContainer } from "@/animate/container"
import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren<BoxProps & MotionProps> {
  animate?: boolean
  action?: boolean
}

export function MotionContainer({
  animate,
  action = false,
  children,
  ...other
}: Props) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate={animate ? "animate" : "exit"}
        variants={animateContainer()}
        {...other}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animateContainer()}
      {...other}
    >
      {children}
    </Box>
  )
}
