export const APP_WIDTH = 1024
export const APP_HEIGHT = 768
export const SIDEBAR_RATIO = 0.2

export const CANVAS_WIDTH = APP_WIDTH * (1 - SIDEBAR_RATIO)
export const CANVAS_HEIGHT = APP_HEIGHT

export const DEFAULT_STICKY_SIZE = 80

export const MIN_STICKY_SIZE = 40
export const MAX_STICKY_SIZE = 200
export const MIN_POSITION_VALUE = 0
export const MAX_POSITION_VALUE = 100
export const MAX_TEXT_LENGTH = 100

export const DEFAULT_STICKY_X = Math.round(
  (CANVAS_WIDTH - DEFAULT_STICKY_SIZE) / 2,
)
export const DEFAULT_STICKY_Y = Math.round(
  (CANVAS_HEIGHT - DEFAULT_STICKY_SIZE) / 2,
)
