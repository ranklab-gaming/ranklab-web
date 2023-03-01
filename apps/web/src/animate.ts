type EaseType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate"
  | number[]

export type Variants = {
  distance?: number
  durationIn?: number
  durationOut?: number
  easeIn?: EaseType
  easeOut?: EaseType
}

export type TransitionHover = {
  duration?: number
  ease?: EaseType
}

export type TransitionEnter = {
  durationIn?: number
  easeIn?: EaseType
}

export type TransitionExit = {
  durationOut?: number
  easeOut?: EaseType
}

export type Background = {
  colors?: string[]
  duration?: number
  ease?: EaseType
}
