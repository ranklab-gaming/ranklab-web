import { animateContainer } from "@/animate/container"
import { useResponsive } from "@/hooks/useResponsive"
import { Box, BoxProps } from "@mui/material"
import { m, MotionProps } from "framer-motion"
import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren<BoxProps & MotionProps> {
  disableAnimatedMobile?: boolean
}

export function MotionViewport({
  children,
  disableAnimatedMobile = true,
  ...other
}: Props) {
  const isDesktop = useResponsive("up", "sm")

  if (!isDesktop && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={animateContainer()}
      {...other}
    >
      {children}
    </Box>
  )
}
