import { Variants } from "../animate"
import { animateTransitionEnter, animateTransitionExit } from "./transition"

export const animateZoom = (props?: Variants) => {
  const distance = props?.distance || 720
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    in: {
      initial: { scale: 0, opacity: 0 },
      animate: {
        scale: 1,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scale: 0,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inUp: {
      initial: { scale: 0, opacity: 0, translateY: distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateY: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateY: distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inDown: {
      initial: { scale: 0, opacity: 0, translateY: -distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateY: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateY: -distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inLeft: {
      initial: { scale: 0, opacity: 0, translateX: -distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateX: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateX: -distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inRight: {
      initial: { scale: 0, opacity: 0, translateX: distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateX: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateX: distance,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    out: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
    outUp: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateY: -distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
    outDown: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateY: distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
    outLeft: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateX: -distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
    outRight: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateX: distance,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
    },
  }
}
