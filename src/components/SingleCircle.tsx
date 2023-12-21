import { memo, forwardRef } from "react"
import { Circle } from "react-konva"
import Konva from "konva"

import type { ForwardedRef } from "react"
import type { CircleConfig } from "konva/lib/shapes/Circle"
import type { IPoint } from "@/types"

interface IProps extends CircleConfig {
    point: IPoint
}

type Ref = ForwardedRef<Konva.Circle>

const SingleCircle = forwardRef(({ point, ...props }: IProps, ref: Ref) => {
    const mixProps: CircleConfig = {
        draggable: true,
        fill: "#fff",
        stroke: "#83eccb",
        radius: 5,
        ...props,
    }

    return (
        <Circle
            {...point} {...mixProps} ref={ref}
            onMouseEnter={e => e.target.getStage()!.container().style.cursor = "pointer"}
            onMouseOut={e => e.target.getStage()!.container().style.cursor = "default"}
        />
    )
})

export default memo(SingleCircle)
