import { memo, forwardRef } from "react"
import { Circle } from "react-konva"
import Konva from "konva"

import type { ForwardedRef } from "react"
import type { KonvaEventObject } from "konva/lib/Node"
import type { IPoint } from "@/types"

interface ICircleProps {
    point: IPoint
    onCircleMove: (evt: KonvaEventObject<DragEvent>) => void
    stroke?: `#${string}` | `rgb(${string})` | `hsl(${string})` | `hue(${string})`
}

type TCircleRef = ForwardedRef<Konva.Circle>

const SingleCircle = forwardRef(({ point, onCircleMove, stroke = "#83eccb" }: ICircleProps, circleRef: TCircleRef) => {
        return (
            <Circle {...point} draggable fill="#fff" stroke={stroke} radius={5} ref={circleRef}
                    onMouseEnter={e => e.target.getStage()!.container().style.cursor = "pointer"}
                    onMouseOut={e => e.target.getStage()!.container().style.cursor = "default"}
                    onDragMove={onCircleMove}
            />
        )
    },
)

export default memo(SingleCircle)
