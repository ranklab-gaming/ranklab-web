import { PropsWithChildren } from "react"
import { domMax, LazyMotion } from "framer-motion"

export function MotionLazyContainer({ children }: PropsWithChildren) {
  return (
    <LazyMotion strict features={domMax}>
      {children}
    </LazyMotion>
  )
}
