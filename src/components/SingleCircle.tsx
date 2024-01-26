import { Circle } from "react-konva"
import Konva from "konva"

import type { ForwardedRef } from "react"
import type { CircleConfig } from "konva/lib/shapes/Circle"

type Ref = ForwardedRef<Konva.Circle>

const SingleCircle = forwardRef(({ point, ...props }: CircleConfig, ref: Ref) => {
    const mixProps = {
        draggable: true,
        fill: "#fff",
        stroke: "#83eccb",
        radius: 5,
        ...props,
    }

    return (
        <Circle
            {...mixProps} {...point} ref={ref}
            onMouseEnter={e => e.target.getStage()!.container().style.cursor = "pointer"}
            onMouseOut={e => e.target.getStage()!.container().style.cursor = "default"}
        />
    )
})

export default memo(SingleCircle)
