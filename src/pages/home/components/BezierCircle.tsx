import { useDispatch } from "react-redux"
import { setSelectPointKey } from "@/stores/home/userInfo"
import SingleCircle from "@/components/SingleCircle"

import type { TKDragEvent } from "@/types"
import type { CircleConfig } from "konva/lib/shapes/Circle"

function BezierCircle({ onDragEnd, onDragMove, index, ...props }: CircleConfig) {
    const mixProps = {
        fill: "#fff",
        draggable: true,
        stroke: null,
        ...props,
    }
    const { name } = props
    const dispatch = useDispatch()
    const handleMouseOver = useCallback(() => dispatch(setSelectPointKey(name)), [])
    const handleDragEnd = useCallback(() => onDragEnd(name), [])
    const handleDragMove = useCallback((e: TKDragEvent) => onDragMove(e, index), [])

    return (
        <SingleCircle
            {...mixProps}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            onMouseOver={handleMouseOver}
        />
    )
}

function propsIsChanged(prevProps: Readonly<CircleConfig>, nextProps: Readonly<CircleConfig>) {
    const { x: x1, y: y1 } = prevProps
    const { x: x2, y: y2 } = nextProps
    return x1 !== x2 && y1 !== y2
}

export default memo(BezierCircle, propsIsChanged)
