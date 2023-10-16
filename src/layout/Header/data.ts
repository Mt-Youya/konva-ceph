export const actionKeys = {
    BRIGHTNESS: "brightness",
    CONTRAST: "contrast",
    ROTATE: "rotate",
    MIRROR: "mirror",

    MAJOR: "major",
    OUTLINE: "outline",
    LATERAL: "lateral",
    SUPPORT: "support",
    NAME: "named",

    DISTANCE: "distance",
    ANGLE: "angle",
    RESET: "reset",
} as const

export type ActionType = (typeof actionKeys)[keyof typeof actionKeys]
