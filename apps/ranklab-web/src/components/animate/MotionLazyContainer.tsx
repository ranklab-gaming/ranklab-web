import { ReactNode } from "react"
import { LazyMotion } from "framer-motion"
import features from "./features"

type Props = {
  children: ReactNode
}

export default function MotionLazyContainer({ children }: Props) {
  return (
    <LazyMotion strict features={features}>
      {children}
    </LazyMotion>
  )
}
