import { domMax, LazyMotion } from "framer-motion"
import { PropsWithChildren } from "react"

export function MotionLazyContainer({ children }: PropsWithChildren) {
  return (
    <LazyMotion strict features={domMax}>
      {children}
    </LazyMotion>
  )
}
