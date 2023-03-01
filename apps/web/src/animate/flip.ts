import { Variants } from "../animate"
import { animateTransitionEnter, animateTransitionExit } from "./transition"

export const animateFlip = (props?: Variants) => {
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    inX: {
      initial: { rotateX: -180, opacity: 0 },
      animate: {
        rotateX: 0,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        rotateX: -180,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inY: {
      initial: { rotateY: -180, opacity: 0 },
      animate: {
        rotateY: 0,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        rotateY: -180,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outX: {
      initial: { rotateX: 0, opacity: 1 },
      animate: {
        rotateX: 70,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outY: {
      initial: { rotateY: 0, opacity: 1 },
      animate: {
        rotateY: 70,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
  }
}
