import { Variants } from "../animate"
import { animateTransitionEnter, animateTransitionExit } from "./transition"

export const animateFade = (props?: Variants) => {
  const distance = props?.distance || 120
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: animateTransitionEnter },
      exit: { opacity: 0, transition: animateTransitionExit },
    },
    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: distance,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: -distance,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: {
        x: 0,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: -distance,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    inRight: {
      initial: { x: distance, opacity: 0 },
      animate: {
        x: 0,
        opacity: 1,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: distance,
        opacity: 0,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    out: {
      initial: { opacity: 1 },
      animate: {
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        opacity: 1,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outUp: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: -distance,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: 0,
        opacity: 1,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outDown: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: distance,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        y: 0,
        opacity: 1,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outLeft: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: -distance,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: 0,
        opacity: 1,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
    outRight: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: distance,
        opacity: 0,
        transition: animateTransitionEnter({ durationIn, easeIn }),
      },
      exit: {
        x: 0,
        opacity: 1,
        transition: animateTransitionExit({ durationOut, easeOut }),
      },
    },
  }
}
