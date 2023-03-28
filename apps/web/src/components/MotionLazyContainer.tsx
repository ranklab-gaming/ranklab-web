import { domMax, LazyMotion } from "framer-motion"
import { PropsWithChildren } from "react"

export const MotionLazyContainer = ({ children }: PropsWithChildren) => {
  return (
    <LazyMotion strict features={domMax}>
      {children}
    </LazyMotion>
  )
}
