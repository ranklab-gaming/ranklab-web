import { Variants } from "../animate"
import { animateTransitionEnter, animateTransitionExit } from "./transition"

export const animateScale = (props?: Variants) => {
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    inX: {
      initial: { scaleX: 0, opacity: 0 },
      animate: {
        scaleX: 1,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scaleX: 0,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inY: {
      initial: { scaleY: 0, opacity: 0 },
      animate: {
        scaleY: 1,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scaleY: 0,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outX: {
      initial: { scaleX: 1, opacity: 1 },
      animate: {
        scaleX: 0,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
    outY: {
      initial: { scaleY: 1, opacity: 1 },
      animate: {
        scaleY: 0,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
  }
}
