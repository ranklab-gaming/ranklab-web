import { Variants } from "../animate"
import { animateTransitionEnter, animateTransitionExit } from "./transition"

export const animateSlide = (props?: Variants) => {
  const distance = props?.distance || 160
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    inUp: {
      initial: { y: distance },
      animate: {
        y: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inDown: {
      initial: { y: -distance },
      animate: {
        y: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: -distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inLeft: {
      initial: { x: -distance },
      animate: {
        x: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: -distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inRight: {
      initial: { x: distance },
      animate: {
        x: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outUp: {
      initial: { y: 0 },
      animate: {
        y: -distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outDown: {
      initial: { y: 0 },
      animate: {
        y: distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outLeft: {
      initial: { x: 0 },
      animate: {
        x: -distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outRight: {
      initial: { x: 0 },
      animate: {
        x: distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
  }
}
