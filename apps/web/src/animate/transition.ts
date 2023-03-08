import { TransitionEnter, TransitionExit, TransitionHover } from "../animate"

export const animateTransitionHover = (props?: TransitionHover) => {
  const duration = props?.duration || 0.32
  const ease = props?.ease || [0.43, 0.13, 0.23, 0.96]

  return { duration, ease }
}

export const animateTransitionEnter = (props?: TransitionEnter) => {
  const duration = props?.durationIn || 0.64
  const ease = props?.easeIn || [0.43, 0.13, 0.23, 0.96]

  return { duration, ease }
}

export const animateTransitionExit = (props?: TransitionExit) => {
  const duration = props?.durationOut || 0.48
  const ease = props?.easeOut || [0.43, 0.13, 0.23, 0.96]

  return { duration, ease }
}
