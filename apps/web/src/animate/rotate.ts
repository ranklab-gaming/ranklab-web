import { Variants } from "../animate"
import { animateTransitionEnter, animateTransitionExit } from "./transition"

export const animateRotate = (props?: Variants) => {
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    in: {
      initial: { opacity: 0, rotate: -360 },
      animate: {
        opacity: 1,
        rotate: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        opacity: 0,
        rotate: -360,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    out: {
      initial: { opacity: 1, rotate: 0 },
      animate: {
        opacity: 0,
        rotate: -360,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
  }
}
